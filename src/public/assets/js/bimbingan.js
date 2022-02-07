$(document).ready(function () {
  initNgage();
});

function initNgage() {
  const roomName = data.logbook.roomName;
  const date = new Date();
  let dateSesi = new Date(data.logbook.date);
  if (!data.logbook.verified) {
    Swal.fire({
      title: 'Bimbingan belum dapat dilakukan',
      text: `Dosen Pembimbing belum menyetujui bimbingan`,
      icon: 'warning',
      confirmButtonText: 'Tutup',
      timer: 1500,
    });
    return;
  }
  if (date.getTime() >= dateSesi.getTime()) {
    $('#videoconf').html('');
    const api = new IFrameVideoAPI({
      roomName: roomName,
      width: '100%',
      height: '100%',
      userInfo: {
        displayName: data.role == 'mahasiswa' ? data.logbook.namaMahasiswa : data.logbook.namaDosen,
      },
      container: document.querySelector('#videoconf'),
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone',
          'camera',
          'desktop',
          'fullscreen',
          'hangup',
          'chat',
          'tileview',
          'stats',
          'videoquality',
          'raisehand',
          'settings',
          'participant-count',
          'videobackgroundblur',
          'mute-everyone',
        ],
      },
      initialSetup: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
      apiID: 'TEST',
      apiKey: 'TEST',
      // apiID: apiNgage.apiId,
      // apiKey: apiNgage.apiKey,
    });
    api.subscribeEvent(api.Events.PARTICIPANT_JOINED, function (e) {
      console.log(e.displayName + ' (' + e.id + ') joined');
    });
  } else {
    Swal.fire({
      title: 'Bimbingan belum dapat dilakukan',
      text: `Bimbingan dapat dilakukan pada tanggal ${dateSesi.toLocaleDateString()}`,
      icon: 'error',
      confirmButtonText: 'Tutup',
      timer: 1500,
    });
  }
}

$('#selectLogbook').on('change', function () {
  if (!data) {
    Swal.fire({
      title: 'Pilih Sesi Terlebih Dahulu',
      text: '',
      icon: 'warning',
      confirmButtonText: 'Tutup',
      timer: 1500,
    });
    return;
  }
  const logbook = $('#logbook');
  switch (this.value) {
    case '1':
      logbook.html(`
          <div class="d-flex flex-column my-2 mx-2 align-items-end">
          <label>Judul Masalah</label>
          <input type="text" class="form-control" name="notesTitle" value="${
            data.logbook.notes.title ? data.logbook.notes.title + '" disabled' : '"'
          } placeholder="Judul dari masalah yang ingin dikonsultasikan"></input>
          <label>Isi Masalah</label>
          <textarea class="form-control mb-2" name="notesContent" value="${
            data.logbook.notes.content ? data.logbook.notes.content + '" disabled' : ''
          } rows="4"" placeholder="Isi dari masalah yang ingin di konsultasikan" required>${
        data.notes.content
          ? data.logbook.notes.content + '</textarea>'
          : `</textarea>
          <button class="btn btn-primary px-2 mx-2" type="submit"><span class="iconly-Send icli"></span></button>
          </div>`
      }
        `);
      break;
    case '2':
      logbook.html(`
        <div class="d-flex flex-column my-2 mx-2 align-items-end">
        <label>Hal yang harus dilakukan</label>
        <textarea class="form-control" value="${data.logbook.actions.content}" rows="4" disabled placeholder="Hal yang harus anda lakukan"></textarea>
        </div>
      `);
      break;
    case '3':
      logbook.html(`
        <div class="d-flex flex-row my-2 mx-2 align-items-end">
        ${
          data.attachments.file
            ? `<a href="/storage/${data.logbook.attachments.file}" class="btn btn-primary" target="_blank">Lampiran</a>`
            : `
        <input class="form-control" type="file" name="lampiran">
        <button class="btn btn-primary px-2 mx-2"><span
            class="iconly-Send icli"></span></button>
            `
        }
        </div>
      `);
      break;
    default:
      return;
  }
});

$('#logbook').on('submit', function (e) {
  e.preventDefault();
  const form = $(this)[0];
  let formData;
  let settings;
  console.log(data);
  if ($('input[name="lampiran"]').val()) {
    formData = new FormData(form);
    settings = {
      url: `/api/logbook/${data.logbook._id}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      processData: false,
      mimeType: 'multipart/form-data',
      cache: false,
      contentType: false,
      data: formData,
    };
  } else {
    console.log('json');
    formData = {
      notes: {
        title: $('input[name="notesTitle"]').val(),
        content: $('textarea[name="notesContent"]').val(),
      },
    };
    settings = {
      url: `/api/logbook/${data.logbook._id}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(formData),
    };
  }
  $.ajax(settings)
    .done(function (res) {
      if (!res.data) {
        res = JSON.parse(res);
      }
      data = res.data;
      if (formData.notes) {
        $('#selectLogbook').trigger('change');
      }
      Swal.fire({
        title: 'Berhasil',
        text: '',
        icon: 'success',
        confirmButtonText: 'tutup',
        timer: 1500,
      });
    })
    .fail(function (error) {
      alert(error.textStatus);
    });
});
