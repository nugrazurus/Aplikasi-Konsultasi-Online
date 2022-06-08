const modalTambah = $('#modalTambahSesi');
let token = document.cookie.match(new RegExp('(^| )' + 'AuthToken' + '=([^;]+)'))[2];
token = token.replace('AuthToken=', '');
let idLogbook = '';

$(document).ready(() => {
  getAllSesi();
});

function show() {
  modalTambah.modal('show');
}

function getAllSesi() {
  let token = document.cookie.match(new RegExp('(^| )' + 'AuthToken' + '=([^;]+)'))[2];
  token = token.replace('AuthToken=', '');
  const table = $('.table tbody');
  const data = $.ajax({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    async: false,
    url: `/api/logbook/mahasiswa/${nim}`,
  })
    .done((data) => {
      let row = ``;
      let button = ``;
      $.each(data.data, (key, val) => {
        button += `
                <div id="${
                  val._id
                }" class="button-sesi card d-flex flex-row justify-content-center align-items-center px-4 py-3 mx-2">
                    <a href="#" onclick="showLogbook('${val._id}')" class="stretched-link">Sesi Ke-${key + 1}</a>
                </div>
            `;
        row += `
            <tr><td>Ke - ${key + 1}</td>
                <td>${new Date(val.date).toLocaleDateString()}</td>
                <td>
                  <div class="btn-group">
                    <button type="button" class="btn btn-light" data-bs-toggle="dropdown" aria-expanded="false">
                      <span class="iconly-Setting icli" style="color: #48C39F;"></span>
                    </button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#" onclick="hapusSesi('${val._id}')">Hapus</a></li>
                      </ul>
                      </div>
                      </td>
                      </tr>
                      `;
        // <li><a class="dropdown-item" href="#">Edit</a></li>
      });
      table.html(row);
      $('#buttonSesi').html(button);
    })
    .fail((err) => {
      console.log(err);
      Swal.fire({
        title: 'Gagal mengambil data',
        text: err.textStatus,
        icon: 'error',
        confirmButtonText: 'Tutup',
        timer: 1500,
      });
    });
}

function showLogbook(id) {
  $('#tambahLogbook').removeClass('d-none');
  $('.col-9').find('p').addClass('d-none');
  idLogbook = id;
  const button = $('.button-sesi');
  $.each(button, function (key, val) {
    if (val.id === idLogbook) {
      $(val).css('border', '1px solid #48C39F').children('a').css('color', '#48C39F');
    } else {
      $(val).css('border', '1px solid rgba(0,0,0,.125)').children('a').css('color', 'black');
    }
  });
  $.ajax({
    url: `/api/logbook/${id}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
    .done(function (data) {
      console.log(data.data.notes);
      const notes = data.data.notes.map(
        (note, ind) =>
          `<div class="accordion-item mb-4">
        <h2 class="accordion-header" id="heading-${ind}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapse-${ind}" aria-expanded="false" aria-controls="collapse-${ind}">
            <b>${note.title}</b>
          </button>
        </h2>
        <div id="collapse-${ind}" class="accordion-collapse collapse ${
            ind === 0 ? 'show' : ''
          }" aria-labelledby="heading-${ind}">
          <div class="accordion-body">
            <div class="d-flex flex-column">
              <div class="d-flex justify-content-end">
                <button onClick="" class="btn btn-danger" ><span class="iconly-Delete icli"></span></button>
              </div>
              <div class="form-group">
                <label for="">Catatan</label>
                <textarea class="form-control mb-2" name="contentMasalah" rows="4" disabled>${note.content}</textarea>
              </div>
              ${
                note.attachments.file
                  ? `<a href="/storage/${note.attachments.file}" target="_blank" class="btn btn-primary">Lampiran</a>`
                  : ''
              }
            </div>
          </div>
        </div>
      </div>`,
      );
      $('#accordionExample').html(notes);
      $('#buttonMeet').html(
        `<a class="btn btn-primary d-flex align-items-center" href="${data.data.meetLink}" target="_blank"><span class="iconly-Video icli"></span>  Google Meet</a>`,
      );
      console.log(data);
    })
    .fail(function (err, jQxHr, status) {
      showAlert('Gagal menambahkan data', err.textStatus, 'error');
      console.log(err);
    });
}

function submitForm() {
  const data = {
    namaMahasiswa: nama,
    nimMahasiswa: nim,
    date: $('input[name="tanggalSesiKonsultasi"]').val(),
    namaDosen: dosen,
    nipDosen: nipDosen,
  };
  console.log(data);
  $('#simpanSesiKonsultasi').attr('disabled', true);
  $.ajax({
    method: 'POST',
    url: `/api/logbook`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  })
    .done((data) => {
      console.log(data);
      modalTambah.modal('hide');
      getAllSesi();
      $('#simpanSesiKonsultasi').attr('disabled', false);
      showAlert('Berhasil menambahkan data', '', 'success');
    })
    .fail((err) => {
      console.log(err);
      showAlert('Server Error', err.statusText, 'error');
    });
}

$('#formNotes').submit(function (e) {
  e.preventDefault();
  let form = $(this);
  console.log(form);
  let formData = new FormData(form[0]);
  for (let pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
  if (!idLogbook) {
    showAlert('Peringatan', 'Pilih sesi konsultasi terlebih dahulu', 'warning');
    return;
  }
  $.ajax({
    method: 'PUT',
    url: `/api/logbook/note/${idLogbook}`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    processData: false,
    mimeType: 'multipart/form-data',
    cache: false,
    contentType: false,
    data: formData,
  })
    .done(function (data) {
      console.log('done submitting');
      console.log(data);
      showAlert('Berhasil menambahkan logbook', '', 'success');
    })
    .fail((err) => {
      console.error(err);
      showAlert('Gagal menambahkan lampiran', err.textStatus, 'error');
    });
});

function hapusSesi(id) {
  $.ajax({
    method: 'DELETE',
    url: `/api/logbook/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .done(function (data) {
      console.log(data);
      getAllSesi();
      showAlert('Berhasil menghapus sesi', '', 'success');
    })
    .fail(function (err) {
      console.error(err);
      showAlert('Gagal menghapus sesi', err.statusText, 'error');
    });
}

function showAlert(title, text, icon, buttontext = 'Tutup', timer = 1500) {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonText: buttontext,
    timer: timer,
  });
  return;
}
