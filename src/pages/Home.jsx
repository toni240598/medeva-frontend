import React, { useState, useEffect } from 'react';
import { getEmployees } from '../services/api';


const statusList = [
  { status: 'all', label: 'Semua Karyawan' },
  { status: 'active', label: 'Karyawan Aktif' },
  { status: 'inactive', label: 'Karyawan Non-Aktif' },
];
const baseURL = 'http://localhost:3000';


export default function Home() {
  const [employeeList, setEmployeeList] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  // fungsi fetchEmployees di luar useEffect supaya bisa dipanggil ulang
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {
        ...(search && { search: encodeURIComponent(search) }),
        ...(status !== 'all' && { status })
      };

      const data = await getEmployees(params);
      console.log(data);
      setEmployeeList(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     fetchEmployees();
  //   }, 5000); // 5 detik

  //   return () => clearTimeout(handler); // bersihkan debounce saat input berubah
  // }, [search]);

  // Status change effect (langsung fetch tanpa debounce)
  useEffect(() => {
    fetchEmployees();
  }, [status, search]);

  // handler search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // handler status change (misal dropdown)
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div class="mx-auto flex flex-col md:flex-row gap-6 p-4">
      {/* <!-- Left Panel --> */}
      <section class="bg-white rounded-md shadow border border-gray-200 w-full md:w-[30%] flex flex-col p-4">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-xs font-bold text-gray-900 uppercase">DATA KARYAWAN & TENAGA KESEHATAN</h2>
          <ion-icon name="ellipsis-horizontal" class="text-gray-400 text-xl cursor-pointer"></ion-icon>
        </div>
        <form class="space-y-3">
          <div>
            <select class="w-full border border-gray-300 rounded text-xs text-gray-600 placeholder:text-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Semua Karyawan select"
              value={status}
              onChange={handleStatusChange}
            >
              {statusList.map((s) => (
                <option value={s.status}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <div class="flex border border-gray-300 rounded overflow-hidden w-full max-w-[280px]">
              <button type="button"
                className={status == 'all' ? 'text-white bg-gray-500 flex-1 text-[10px] font-semibold py-1 px-2 cursor-pointer select-none'
                  : 'text-gray-400 bg-gray-100 flex-1 text-[10px] font-semibold py-1 px-2 cursor-pointer select-none'}>SEMUA</button>
              <button type="button"
                className={status == 'active' ? 'text-white bg-gray-500 flex-1 text-[10px] font-semibold py-1 px-2 cursor-pointer select-none'
                  : 'text-gray-400 bg-gray-100 flex-1 text-[10px] font-semibold py-1 px-2 cursor-pointer select-none'}>AKTIF</button>
              <button type="button"
                className={status == 'inactive' ? 'text-white bg-gray-500 flex-1 text-[10px] font-semibold py-1 px-2 cursor-pointer select-none'
                  : 'text-gray-400 bg-gray-100 flex-1 text-[10px] font-semibold py-1 px-2 cursor-pointer select-none'}>NON-AKTIF</button>
            </div>
          </div>
          <div class="relative">
            <input type="text" placeholder="Pencarian" onChange={handleSearchChange}
              class="w-full border border-gray-300 rounded text-xs text-gray-600 placeholder:text-gray-400 px-2 py-1 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <button type="submit" aria-label="Search"
              class="absolute right-1 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600">
              <ion-icon name="search-outline" class="text-lg"></ion-icon>
            </button>
          </div>
        </form>
        <table class="w-full mt-3 text-xs text-gray-700 border-collapse border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="border border-gray-200 p-1 w-6 text-center">#</th>
              <th class="border border-gray-200 p-1 text-left">Karyawan / Tenaga Kesehatan</th>
              <th class="border border-gray-200 p-1 w-10"></th>
            </tr>
          </thead>
          <tbody class="max-h-[300px] overflow-y-auto">
            {
              employeeList.map((e, index) => (
                <tr class="border border-gray-200">
                  <td class="border border-gray-200 p-1 text-center align-top">{index + 1}</td>
                  <td class="border border-gray-200 p-3 align-top d-flex">
                    <img
                      src={baseURL + e.photoUrl}
                      alt="Profile"
                      className="rounded-circle img-thumbnail"
                      style={{ width: '100px', height: '100px' }}
                    />
                    <div class="ms-5 pt-1">
                      <p class="font-bold text-gray-900 leading-tight">{e.fullName}</p>
                      <p class="text-[10px] text-gray-600 leading-tight">{e.jobTitle.name}</p>
                      <span
                        className={`inline-block text-white text-[8px] font-semibold px-1 rounded select-none mt-1 ${e.status === 'active' ? 'bg-green-700' : 'bg-red-700'
                          }`}
                      >
                        {e.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </td>
                  <td class="border border-gray-200 p-1 text-center align-top">
                    <button
                      class="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <ion-icon name="arrow-forward-outline" class="text-sm"></ion-icon>
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <div class="relative self-start mt-2">
          {/* <ion-icon name="add-outline" class="text-gray-600 text-xl cursor-pointer"></ion-icon> */}
          <div
            class="absolute top-full right-0 bg-white border border-gray-300 rounded shadow-md w-40 text-xs font-semibold text-gray-700 hidden group-hover:block z-10">
            <button
              class="w-full text-left px-3 py-1 hover:bg-gray-100 border-b border-gray-200 cursor-pointer flex items-center gap-2">
              <ion-icon name="add-outline" class="text-base"></ion-icon> Tambah Karyawan
            </button>
            <button
              class="w-full text-left px-3 py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <ion-icon name="copy-outline" class="text-base"></ion-icon> Salin Data Karyawan
            </button>
          </div>
        </div>
      </section>

      {/* <!-- Middle and Right Panel --> */}
      <section class="bg-white rounded-md shadow border border-gray-200 w-full md:w-[70%] flex gap-6 p-4">
        <form class="flex flex-col md:flex-row gap-6 w-full">
          {/* <!-- Middle Panel --> */}
          <div class="flex flex-col gap-3 w-full md:w-1/2">
            <h3 class="text-xs font-bold text-gray-900 uppercase">FORM TAMBAH KARYAWAN</h3>
            <div>
              <label for="namaLengkap" class="block text-[10px] font-semibold text-gray-700 mb-1">Nama Lengkap <span
                class="text-red-600">*</span></label>
              <input id="namaLengkap" type="text" placeholder="Nama Lengkap"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label for="noKartuIdentitas" class="block text-[10px] font-semibold text-gray-700 mb-1">No. Kartu Identitas<span
                class="text-gray-400 text-[8px] font-normal"> (Nomor Induk Kependudukan)</span></label>
              <input id="noKartuIdentitas" type="text" placeholder="No. Kartu Identitas"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label for="namaLengkap" class="block text-[10px] font-semibold text-gray-700 mb-1">Jenis Kelamin <span
                class="text-red-600">*</span></label>
              <div class="d-flex justify-content-between text-[10px] font-semibold text-gray-700 gap-2">
                <label class="flex items-center gap-1 mt-1">
                  <input type="radio" name="tipeRadio" value="Perawat" class="w-3 h-3" />
                  Laki-Laki
                </label>
                <label class="flex items-center gap-1 mt-1 min-w-[300px]">
                  <input type="radio" name="tipeRadio" value="Bidan" class="w-3 h-3" />
                  Perempuan
                </label>
              </div>
            </div>
            <div>
              <label for="tempatLahir" class="block text-[10px] font-semibold text-gray-700 mb-1">Tempat Lahir</label>
              <input id="tempatLahir" type="text" placeholder="Tempat Lahir"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label for="tanggalLahir" class="block text-[10px] font-semibold text-gray-700 mb-1">Tanggal Lahir</label>
              <input id="tanggalLahir" type="text" placeholder="dd/mm/yyyy"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label for="noTelepon" class="block text-[10px] font-semibold text-gray-700 mb-1">No. Telepon</label>
              <input id="noTelepon" type="text" placeholder="No. Telepon"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="provinsi" class="block text-[10px] font-semibold text-gray-700 mb-1">Provinsi</label>
                <select id="provinsi"
                  class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Pilih Provinsi</option>
                </select>
              </div>
              <div>
                <label for="kotaKabupaten" class="block text-[10px] font-semibold text-gray-700 mb-1">Kota / Kabupaten</label>
                <select id="kotaKabupaten"
                  class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Pilih Kota/Kabupaten</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="kecamatan" class="block text-[10px] font-semibold text-gray-700 mb-1">Kecamatan</label>
                <select id="kecamatan"
                  class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Pilih Kecamatan</option>
                </select>
              </div>
              <div>
                <label for="kelurahan" class="block text-[10px] font-semibold text-gray-700 mb-1">Kelurahan</label>
                <select id="kelurahan"
                  class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Pilih Kelurahan</option>
                </select>
              </div>
            </div>
            <div>
              <label for="detilAlamat" class="block text-[10px] font-semibold text-gray-700 mb-1">Detil Alamat</label>
              <textarea id="detilAlamat" rows="3" placeholder="Alamat"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
            </div>
          </div>

          {/* <!-- Right Panel --> */}
          <div class="flex flex-col gap-3 w-full md:w-1/2">
            <div>
              <label for="username" class="block text-[10px] font-semibold text-gray-700 mb-1">Username <span
                class="text-red-600">*</span></label>
              <input id="username" type="text" placeholder="Username"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label for="email" class="block text-[10px] font-semibold text-gray-700 mb-1">Email <span
                class="text-red-600">*</span></label>
              <input id="email" type="email" placeholder="Email"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label for="password" class="block text-[10px] font-semibold text-gray-700 mb-1">Password <span
                class="text-red-600">*</span></label>
              <div class="relative">
                <input id="password" type="password" placeholder="Password"
                  class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <button type="button" aria-label="Toggle password visibility"
                  class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <ion-icon name="eye-outline" class="text-sm"></ion-icon>
                </button>
              </div>
            </div>
            <fieldset class="text-[10px] font-semibold text-gray-700 gap-2">
              <legend>Tipe <span class="text-red-600">*</span></legend>
              <div class="d-flex justify-content-between">
                <div>
                  <label class="flex items-center gap-1 mt-1">
                    <input type="checkbox" name="tipe" value="Manager" class="w-3 h-3" />
                    Manager
                  </label>
                  <label class="flex items-center gap-1 mt-1">
                    <input type="checkbox" name="tipe" value="Admin" checked class="w-3 h-3" />
                    Admin
                  </label>
                  <label class="flex items-center gap-1 mt-1">
                    <input type="checkbox" name="tipe" value="Resepsionis" class="w-3 h-3" />
                    Resepsionis
                  </label>
                  <label class="flex items-center gap-1 mt-1">
                    <input type="checkbox" name="tipe" value="Manajemen" class="w-3 h-3" />
                    Manajemen
                  </label>
                  <label class="flex items-center gap-1 mt-1">
                    <input type="checkbox" name="tipe" value="Finance" class="w-3 h-3" />
                    Finance
                  </label>
                  <label class="flex items-center gap-1 mt-1">
                    <input type="checkbox" name="tipe" value="Kasir" class="w-3 h-3" />
                    Kasir
                  </label>
                  <label class="flex items-center gap-1 mt-1">
                    <input type="checkbox" name="tipe" value="Purchasing" class="w-3 h-3" />
                    Purchasing
                  </label>
                </div>
                <div class="min-w-[400px]">
                  <label class="flex items-center gap-1 mt-1">
                    <input type="radio" name="tipeRadio" value="Perawat" class="w-3 h-3" />
                    Perawat
                  </label>
                  <label class="flex items-center gap-1 mt-1">
                    <input type="radio" name="tipeRadio" value="Bidan" class="w-3 h-3" />
                    Bidan
                  </label>
                  <label class="flex items-center gap-1 mt-1">
                    <input type="radio" name="tipeRadio" value="Dokter" class="w-3 h-3" />
                    Dokter
                  </label>
                  <label class="flex items-center gap-1 mt-1">
                    <input type="radio" name="tipeRadio" value="Lainnya" checked class="w-3 h-3" />
                    Lainnya
                  </label>
                  <input type="text" placeholder="Lainnya"
                    class="border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2 min-w-[400px]" />
                </div>
              </div>
            </fieldset>
            <div>
              <label for="tglMulaiKontrak" class="block text-[10px] font-semibold text-gray-700 mb-1">Tanggal Mulai
                Kontrak</label>
              <input id="tglMulaiKontrak" type="text" value="01/01/2024"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label for="tglSelesaiKontrak" class="block text-[10px] font-semibold text-gray-700 mb-1">Tanggal Selesai
                Kontrak</label>
              <input id="tglSelesaiKontrak" type="text" value="01/01/2029"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label for="statusMenikah" class="block text-[10px] font-semibold text-gray-700 mb-1">Status Menikah</label>
              <select id="statusMenikah"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Pilih Status</option>
              </select>
            </div>
            <div>
              <label for="kodeDokterBPJS" class="block text-[10px] font-semibold text-gray-700 mb-1">Kode Dokter BPJS</label>
              <select id="kodeDokterBPJS"
                class="w-full border border-gray-300 rounded text-xs text-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Pilih Kode Dokter</option>
              </select>
            </div>
            <div class="flex justify-end mt-auto">
              <button type="submit"
                class="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded px-4 py-1">Simpan</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
