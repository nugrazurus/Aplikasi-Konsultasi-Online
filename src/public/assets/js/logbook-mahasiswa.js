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
    url: `/api/logbook/${nim}`,
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
    url: `/api/logbook/id/${id}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
    .done(function (data) {
      if (data.data.notes.title !== null) {
        $('#buttonMasalah').hide();
        $('input[name="titleMasalah"]').val(data.data.notes.title).attr('disabled', true);
        $('textarea[name="contentMasalah"]').val(data.data.notes.content).attr('disabled', true);
      } else {
        $('#buttonMasalah').show();
        $('input[name="titleMasalah"]').val('').attr('disabled', false);
        $('textarea[name="contentMasalah"]').val('').attr('disabled', false);
      }
      if (data.data.actions.content !== null) {
        $('input[name="contentAction"]').val(data.data.actions.content);
      } else {
        $('input[name="contentAction"]').val('');
      }
      if (data.data.attachments.file !== null) {
        $('#formLampiran').hide();
        $('#iframepdf')
          .show()
          .html(
            `<object data="/storage/${data.data.attachments.file}" type="application/pdf" width="100%" height="500px"><iframe src="https://docs.google.com/viewer?url=/storage/${data.data.attachments.file}&embedded=true" width="100%"></iframe></object>`,
          );
      } else {
        $('#formLampiran').show();
        $('#iframepdf').hide().html('');
      }
      console.log(data);
    })
    .fail(function (err, jQxHr, status) {
      Swal.fire({
        title: 'Gagal menambahkan data',
        text: err.textStatus,
        icon: 'error',
        confirmButtonText: 'Tutup',
        timer: 1500,
      });
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
      Swal.fire({
        title: 'Berhasil menambahkan data',
        text: '',
        icon: 'success',
        confirmButtonText: 'Tutup',
        timer: 1500,
      });
    })
    .fail((err) => {
      console.log(err);
      Swal.fire({
        title: 'Server Error',
        text: err.statusText,
        icon: 'error',
        confirmButtonText: 'Tutup',
        timer: 1500,
      });
      alert(err.statusText);
    });
}

$('#formMasalah').submit(function (e) {
  e.preventDefault();
  console.log('submit form masalah');
  if (idLogbook === '') {
    Swal.fire({
      title: 'Silahkan pilih sesi',
      text: '',
      icon: 'warning',
      confirmButtonText: 'Tutup',
      timer: 1500,
    });
    return;
  }
  const data = {
    notes: {
      title: $('input[name="titleMasalah"]').val(),
      content: $('textarea[name="contentMasalah"]').val(),
    },
  };
  console.log(data);
  $.ajax({
    method: 'PUT',
    url: `/api/logbook/id/${idLogbook}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  })
    .done(function (data) {
      console.log(data);
      Swal.fire({
        title: 'Berhasil input masalah',
        text: '',
        icon: 'success',
        confirmButtonText: 'Tutup',
        timer: 1500,
      });
      getAllSesi();
      showLogbook(data.data._id);
    })
    .fail(function (error) {
      console.log(error);
      Swal.fire({
        title: 'Server Error',
        text: error.statusText,
        icon: 'error',
        confirmButtonText: 'Tutup',
        timer: 1500,
      });
    });
});

$('#formLampiran').submit(function (e) {
  e.preventDefault();
  if (idLogbook === '') {
    Swal.fire({
      title: 'Silahkan pilih sesi',
      text: '',
      icon: 'warning',
      confirmButtonText: 'Tutup',
      timer: 1500,
    });
    return;
  }
  let form = $(this);
  let formData = new FormData(form[0]);
  for (let pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
  $.ajax({
    method: 'PUT',
    url: `/api/logbook/id/${idLogbook}`,
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
      data = JSON.parse(data);
      console.log(data);
      form[0].reset();
      Swal.fire({
        title: 'Berhasil menambahkan lampiran',
        text: '',
        icon: 'success',
        confirmButtonText: 'Tutup',
        timer: 1500,
      });
      getAllSesi();
      showLogbook(data.data._id);
      console.log('berhasil menampilkan data');
    })
    .fail(function (err) {
      console.error(err);
      Swal.fire({
        title: 'Gagal menambahkan lampiran',
        text: err.textStatus,
        icon: 'error',
        confirmButtonText: 'Tutup',
        timer: 1500,
      });
    });
});

function hapusSesi(id) {
  $.ajax({
    method: 'DELETE',
    url: `/api/logbook/id/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .done(function (data) {
      console.log(data);
      getAllSesi();
      Swal.fire({
        title: 'Berhasil menghapus sesi',
        text: '',
        icon: 'success',
        confirmButtonText: 'Tutup',
        timer: 1500,
      });
    })
    .fail(function (err) {
      Swal.fire({
        title: 'Gagal menghapus sesi',
        text: err.statusText,
        icon: 'error',
        confirmButtonText: 'Tutup',
        timer: 1500,
      });
    });
}
