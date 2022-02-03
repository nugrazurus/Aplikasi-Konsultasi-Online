let token = document.cookie.match(new RegExp('(^| )' + 'AuthToken' + '=([^;]+)'))[2];
let dataSesiMhs;
let data;
let apiNgage;
token = token.replace('AuthToken=', '');
$(document).ready(function () {
  getAllSesi();
});
function getAllSesi() {
  const data = $.ajax({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    async: false,
    url: `/api/logbook/${nim}`,
  })
    .done((data) => {
      dataSesiMhs = data.data;
      let opt = `<option value hidden>-- Pilih Sesi --</option>`;
      $.each(data.data, function (key, val) {
        opt += `
                <option value="${val.roomName}" >Sesi Ke - ${key + 1}</option>
                `;
      });
      $('select[name="sesi"]').html(opt);
    })
    .fail((err) => {
      console.log(err);
      alert('gagal mengambil data');
    });
}
$('select[name="sesi"]').change(function () {
  const sel = $(this);
  $('#sesiKe').html(sel[0][sel[0].selectedIndex].innerText.replace('Sesi ', ''));
  const roomName = $(this).val();
  data = dataSesiMhs.find((val) => val.roomName == roomName);
  const date = new Date();
  let dateSesi = new Date(data.date);
  if (!data.verified) {
    Swal.fire({
      title: 'Bimbingan belum dapat dilakukan',
      text: `Dosen Pembimbing belum menyetujui bimbingan`,
      icon: 'warning',
      confirmButtonText: 'Tutup',
      timer: 1500,
    })  
    return
  }
  if (date.getTime() >= dateSesi.getTime()) {
    $('#videoconf').html('');
    const api = new IFrameVideoAPI({
      roomName: roomName,
      width: '100%',
      height: '100%',
      userInfo: {
        displayName: nama,
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
});

$('#selectLogbook').on('change', function () {
  if (!data) {
    Swal.fire({
      title: 'Pilih Sesi Terlebih Dahulu',
      text: '',
      icon: 'warning',
      confirmButtonText: 'Tutup',
      timer: 1500,
    });
    return
  }
  const logbook = $('#logbook')
  switch (this.value) {
    case "1":
        logbook.html(`
          <div class="d-flex flex-column my-2 mx-2 align-items-end">
          <label>Judul Masalah</label>
          <input type="text" class="form-control" name="notesTitle" value="${data.notes.title? data.notes.title+'" disabled' : '"'} placeholder="Judul dari masalah yang ingin dikonsultasikan"></input>
          <label>Isi Masalah</label>
          <textarea class="form-control mb-2" name="notesContent" value="${data.notes.content? data.notes.content+'" disabled' : ''} rows="4"" placeholder="Isi dari masalah yang ingin di konsultasikan" required>${data.notes.content? data.notes.content+'</textarea>' : `</textarea>
          <button class="btn btn-primary px-2 mx-2" type="submit"><span class="iconly-Send icli"></span></button>
          </div>`}
        `);
      break;
    case "2":
      logbook.html(`
        <div class="d-flex flex-column my-2 mx-2 align-items-end">
        <label>Hal yang harus dilakukan</label>
        <textarea class="form-control" value="${data.actions.content}" rows="4" disabled placeholder="Hal yang harus anda lakukan"></textarea>
        </div>
      `)
      break;
    case "3":
      logbook.html(`
        <div class="d-flex flex-column my-2 mx-2 align-items-end">
        </div>
      `)
      break;
    default:
      return;
  }
})

$('#logbook').on('submit', function (e) {
  e.preventDefault();
  const form = $(this)[0];
  let formData
  let settings
  console.log(data);
  if ($('input[name="lampiran"]').val()) {
    formData = new FormData(form);
    settings = {
      url: `/api/logbook/id/${data._id}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
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
       content: $('textarea[name="notesContent"]').val()
     }
    }
    settings = {
      url: `/api/logbook/id/${data._id}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(formData),
    };
  }
  $.ajax(settings)
  .done(function (res) {
    console.log(res);
    if (!res.data) {
      res = JSON.parse(res).data
    }
    data = res;
    // console.log(data);
    $('#logbook').trigger('change');
    alert('berhasil')
    Swal.fire({
      title: 'Berhasil',
      text: '',
      icon: 'success',
      confirmButtonText: 'tutup',
      timer: 1500
    })
  })
  .fail(function(error){
    alert(error.textStatus)
  })
})

