import React, { useState, useEffect } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { getEmployees, getJobTitles, getRoles, getProvinces, getCities, getDistricts, getVillages, getDoctorCodes, } from '../services/api';


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
  const isEmpty = (value) => {
    return !value || value.trim() === '';
  };

  // form
  const [fullName, setFullName] = useState("");
  const [touchedFullName, setTouchedFullName] = useState(false);

  const [identityNumber, setIdentityNumber] = useState("");
  const [touchedIdentityNumber, setTouchedIdentityNumber] = useState(false)

  const [gender, setGender] = useState("");
  const [isErrorGender, setIsErrorGender] = useState(false);
  const handleChangeGender = (e) => {
    setGender(e.target.value);
    setIsErrorGender(false);
  };
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [jobTitleList, setJobTitleList] = useState([]);
  const [jobTitleId, setJobTitleId] = useState(null);
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [roleIds, setRoleIds] = useState([]);
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [martialStatus, setMartialStatus] = useState('single');
  const [addressDetail, setAddressDetail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [doctorCodeList, setDoctorCodeList] = useState([]);
  const [doctorCodeId, setDoctorCodeId] = useState(null);
  const [provinceList, setProvinceList] = useState([]);
  const [provinceId, setProvinceId] = useState(null);
  const handleProvinceChange = (e) => {
    const _provinceId = e.target.value;
    setProvinceId(_provinceId);
    setCityId(null);
    setFilteredCities(cityList.filter(c => c.id == e.target.value));
  }
  const [cityList, setCityList] = useState([]);
  const [cityId, setCityId] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const handleCityChange = (e) => {
    setCityId(e.target.value);
  }

  const [uploadProfile, setUploadProfile] = useState(null);
  const handleFileChange = (e) => {
    setUploadProfile(e.target.files[0]); // ambil file pertama
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roles = await getRoles();
        setRoleList(roles);
        const jobTitles = await getJobTitles();
        setJobTitleList(jobTitles);
        const doctorCodes = await getDoctorCodes();
        setDoctorCodeList(doctorCodes);
        const provinces = await getProvinces();
        setProvinceList(provinces);
        const cities = await getCities();
        setCityList(cities);
        setFilteredCities(cities);
      } catch (error) {
        console.error("Gagal ambil job titles", error);
      }
    };
    fetchData();
  }, []);

  // Status change effect
  useEffect(() => {
    fetchEmployees();
  }, [status, search]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setRoleIds((prev) =>
      prev.includes(value)
        ? prev.filter((id) => id !== value)
        : [...prev, value]
    );
  };

  // handler search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // handler status change (misal dropdown)
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouchedFullName(true);
    setTouchedIdentityNumber(true);
    const errorGender = isEmpty(gender);
    setIsErrorGender(errorGender);

    console.log(roleIds, jobTitleId, customJobTitle, gender, fullName, identityNumber,
      birthPlace, birthDate, phoneNumber, contractStartDate, contractEndDate, addressDetail,
      username, email, password, doctorCodeId, uploadProfile, provinceId,
    );
  }

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
      <section class="bg-white rounded-md shadow w-full md:w-[70%] flex gap-6 p-4">
        <form class="flex flex-col md:flex-row gap-6 w-full" onSubmit={handleSubmit} validate>
          {/* <!-- Middle Panel --> */}
          <div class="flex flex-col gap-3 w-full md:w-1/2">
            <h3 class="text-xs font-bold text-gray-900 uppercase">FORM TAMBAH KARYAWAN</h3>

            <div>
              <label htmlFor="fullName" className="block text-[10px] font-semibold text-gray-700 mb-1">
                Nama Lengkap <span className="text-red-600">*</span>
              </label>
              <input type="text" id="fullName" name="fullName" placeholder="Nama Lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => setTouchedFullName(true)}
                className={`w-full border rounded text-xs px-2 py-1 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500  border-gray-300 text-gray-400`}
              />
              {touchedFullName && isEmpty(fullName) && (
                <p className="text-red-600 text-[10px] mb-0">Nama Lengkap wajib diisi.</p>
              )}
            </div>

            <div>
              <label htmlFor="noKartuIdentitas" className="block text-[10px] font-semibold text-gray-700 mb-1">
                No. Kartu Identitas
                <span class="text-gray-400 text-[8px] font-normal"> (Nomor Induk Kependudukan)</span>
                <span className="text-red-600">*</span>
              </label>
              <input type="text" id="identityNumber" name="identityNumber" placeholder="No. Kartu Identitas"
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                onBlur={() => setTouchedIdentityNumber(true)}
                className={`w-full border rounded text-xs px-2 py-1 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500  border-gray-300 text-gray-400`}
              />
              {touchedIdentityNumber && isEmpty(identityNumber) && (
                <p className="text-red-600 text-[10px] mb-0">No. Kartu Identitas wajib diisi.</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-[10px] font-semibold text-gray-700 mb-1">
                Jenis Kelamin <span className="text-red-600">*</span>
              </label>
              <div
                className="flex justify-between text-[10px] font-semibold text-gray-700 gap-2"
              >
                <label className="flex items-center gap-1 mt-1">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={handleChangeGender}
                    className="w-3 h-3"
                  />
                  Laki-Laki
                </label>
                <label className="flex items-center gap-1 mt-1 min-w-[300px]">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={handleChangeGender}
                    className="w-3 h-3"
                  />
                  Perempuan
                </label>
              </div>
              {isErrorGender && (
                <p className="text-red-500 text-[10px] mt-1 mb-0">Jenis Kelamin wajib dipilih</p>
              )}
            </div>

            <div>
              <label htmlFor="birthPlace" className="block text-[10px] font-semibold text-gray-700 mb-1">
                Tempat Lahir
              </label>
              <input type="text" id="birthPlace" name="birthPlace" placeholder="Tempat Lahir"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                className={`w-full border rounded text-xs px-2 py-1 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500  border-gray-300 text-gray-400`}
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-[10px] font-semibold text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                placeholder="dd/mm/yyyy"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-[10px] font-semibold text-gray-700 mb-1">
                No. Telepon
              </label>
              <input type="text" id="phoneNumber" name="phoneNumber" placeholder="No. Telepon"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`w-full border rounded text-xs px-2 py-1 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500  border-gray-300 text-gray-400`}
              />
            </div>

            <div class="grid grid-cols-2 gap-3">

              <div>
                <label htmlFor="provinsi" className="block text-[10px] font-semibold text-gray-700 mb-1">
                  Provinsi
                </label>
                <select
                  id="provinsi"
                  value={provinceId}
                  onChange={handleProvinceChange}
                  className="w-full border border-gray-300 rounded text-xs text-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Pilih Provinsi</option>
                  {provinceList.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="kotaKabupaten" className="block text-[10px] font-semibold text-gray-700 mb-1">
                  Kota / Kabupaten
                </label>
                <select
                  id="kotaKabupaten"
                  value={cityId}
                  onChange={handleCityChange}
                  className="w-full border border-gray-300 rounded text-xs text-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Pilih Kota/Kabupaten</option>
                  {filteredCities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
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
              <label htmlFor="uploadProfile" className="block text-[10px] font-semibold text-gray-700 mb-1">
                Foto Profile
              </label>
              <input
                id="uploadProfile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="addressDetail" class="block text-[10px] font-semibold text-gray-700 mb-1">Detil Alamat</label>
              <textarea id="addressDetail" rows="3" placeholder="Alamat" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)}
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
            </div>

          </div>

          {/* <!-- Right Panel --> */}
          <div class="flex flex-col gap-3 w-full md:w-1/2 mt-[40px]">

            <div>
              <label for="username" class="block text-[10px] font-semibold text-gray-700 mb-1">Username <span
                class="text-red-600">*</span></label>
              <input id="username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div>
              <label for="email" class="block text-[10px] font-semibold text-gray-700 mb-1">Email <span
                class="text-red-600">*</span></label>
              <input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                class="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-semibold text-gray-700 mb-1">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="text-sm" />
                  ) : (
                    <IoEyeOutline className="text-sm" />
                  )}
                </button>
              </div>
            </div>

            <fieldset class="text-[10px] font-semibold text-gray-700 gap-2 mt-[-5px]">
              <label class="block text-[10px] font-semibold text-gray-700 mb-1">Tipe <span class="text-red-600">*</span></label>
              <div class="d-flex justify-content-between">
                <div>
                  {roleList.map((role) => (
                    <label key={role.id} className="flex items-center gap-1 mt-1">
                      <input
                        type="checkbox"
                        name="tipe"
                        value={role.id}
                        checked={roleIds.includes(String(role.id))}
                        onChange={handleCheckboxChange}
                        className="w-3 h-3"
                      />
                      {role.name}
                    </label>
                  ))}
                </div>
                <div className="min-w-[400px]">
                  {jobTitleList.map((item) => (
                    <label key={item.id} className="flex items-center gap-1 mt-1">
                      <input
                        type="radio"
                        name="jobTitleId"
                        value={item.id}
                        className="w-3 h-3"
                        checked={jobTitleId === item.id}
                        onChange={(e) => setJobTitleId(Number(e.target.value))}
                      />
                      {item.name}
                    </label>
                  ))}

                  <input
                    type="text"
                    placeholder="Lainnya"
                    disabled={jobTitleId !== 4}
                    value={customJobTitle}
                    onChange={(e) => setCustomJobTitle(e.target.value)}
                    className={`border rounded text-xs px-2 py-1 focus:outline-none focus:ring-1 mt-2 min-w-[400px]
                        ${jobTitleId === 4 && !customJobTitle
                        ? 'border-red-500 text-red-500 placeholder-red-300 focus:ring-red-500'
                        : 'border-gray-300 text-gray-400 placeholder:text-gray-300 focus:ring-blue-500'}
                    `}
                  />
                </div>
              </div>
            </fieldset>

            <div>
              <label htmlFor="contractStartDate" className="block text-[10px] font-semibold text-gray-700 mb-1">
                Tanggal Mulai Kontrak
              </label>
              <input
                id="contractStartDate"
                name="contractStartDate"
                type="date"
                placeholder="dd/mm/yyyy"
                value={contractStartDate}
                onChange={(e) => setContractStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="contractEndDate" className="block text-[10px] font-semibold text-gray-700 mb-1">
                Tanggal Mulai Kontrak
              </label>
              <input
                id="contractEndDate"
                name="contractEndDate"
                type="date"
                placeholder="dd/mm/yyyy"
                value={contractEndDate}
                onChange={(e) => setContractEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded text-xs text-gray-400 placeholder:text-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="martialStatus" class="block text-[10px] font-semibold text-gray-700 mb-1">Status Menikah</label>
              <select id="martialStatus"
                value={martialStatus}
                onChange={(e) => setMartialStatus(e.target.value)}
                class="w-full border border-gray-300 rounded text-xs text-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="single">Lajang</option>
                <option value="married">Menikah</option>
                <option value="divorced">Bercerai</option>
              </select>
            </div>

            <div>
              <label htmlFor="kodeDokterBPJS" className="block text-[10px] font-semibold text-gray-700 mb-1">
                Kode Dokter BPJS
              </label>
              <select
                id="kodeDokterBPJS"
                value={doctorCodeId}
                onChange={(e) => setDoctorCodeId(e.target.value)}
                className="w-full border border-gray-300 rounded text-xs text-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Pilih Kode Dokter</option>
                {doctorCodeList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.description}
                  </option>
                ))}
              </select>
            </div>

            <div class="flex justify-end mt-auto">
              <button type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded px-4 py-1">Simpan</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
