# Documentation

## Overview
All requests are made to endpoints beginning ~~https://odd-gray-meerkat-boot.cyclic.app/api/v1/mbkm/mahasiswa~~  https://kerjapraktikmbkm-api-92c8d2fa6242.herokuapp.com/api/v1/mbkm/mahasiswa for mahasiswa features and ~~https://odd-gray-meerkat-boot.cyclic.app/api/v1/mbkm/dosen~~ https://kerjapraktikmbkm-api-92c8d2fa6242.herokuapp.com/api/v1/mbkm/mahasiswa for dosen features.
All requests must be secure, i.e. https, not http.

## [CLick here for Postman Documentation](https://documenter.getpostman.com/view/24530478/2s9Ykt6ewi)

## Architectural Design
![archi](https://github.com/moechacino/kerjapraktikmbkm-api/blob/main/docs/archi.jpg)

## Workflow: Uploading File
![workflow](https://github.com/moechacino/kerjapraktikmbkm-api/blob/main/docs/workflow_uploadingfile.jpg)

## Security
- [ ] Use Json Web Token
- [ ] Use hash function to store account password
- [ ] Matching the registered NIP (Dosen) with the NIPs in the database
``` javascript
const nipCollection = mongoose.connection.db.collection("nips");
const existingNIPs = await nipCollection.find({ nip: data.nip }).toArray();

  if (existingNIPs.length === 0) {
    throw new BadRequestError("NIP Tidak Terdaftar");
  } 
```

## API Endpoints Documentation

### Registration

- **Endpoint for Mahasiswa Registration**
  - `POST /mahasiswa/registration`
  
- **Endpoint for Dosen Registration**
  - `POST /dosen/registration`

**Action:** Getting data from the client and storing it in the database.

### Login

- **Endpoint for Mahasiswa Login**
  - `POST /mahasiswa/login`
  
- **Endpoint for Dosen Login**
  - `POST /dosen/login`

**Action:** Getting data from the client and matching it to the database.

### Changing Password

**Require token**

- **Endpoint for Mahasiswa Changing Password**
  - `POST /mahasiswa/changepassword`
  
- **Endpoint for Dosen Changing Password**
  - `POST /dosen/changepassword`

**Action:** Updating user password in the database.

### Uploading Report

**Require token**

- **Endpoint for Mahasiswa Uploading Report**
  - `POST /mahasiswa/laporan`

**Action:** Getting data file from the client, storing it in Amazon S3, and storing other data in the database.

### Retrieving Report Data

**Require token**

- **Endpoint for Mahasiswa Retrieving Report Data**
  - `GET /mahasiswa/laporan`
  
- **Endpoint for Dosen Retrieving Report Data**
  - `GET /dosen/laporan`
  - `GET /dosen/laporan/:id`

### Giving Report Status to Mahasiswa

**Require token**

- **Endpoint for Dosen Giving Report Status**
  - `PATCH /dosen/edit/:id`

**Action:** Updating data with the ID equal to the parameter ID in the URL in the database.

### Deleting Report

**Require token**

- **Endpoint for Mahasiswa Deleting Report**
  - `DELETE /mahasiswa/delete/:id`

### Uploading KP (Kerja Praktek)

**Require token**

- **Endpoint for Mahasiswa Uploading KP**
  - `POST /mahasiswa/pengajuankp`

**Action:** Getting data file from the client, storing it in Amazon S3, and storing other data in the database.

### Retrieving KP Data

**Require token**

- **Endpoint for Mahasiswa Retrieving KP Data**
  - `GET /mahasiswa/pengajuankp`
  
- **Endpoint for Dosen Retrieving KP Data**
  - `GET /dosen/pengajuankp`

### Giving KP Status

**Require token**

- **Endpoint for Dosen Giving KP Status**
  - `PATCH /dosen/pengajuankp/:statusPengajuan/:id`

**Action:** Updating data to the database.

### Deleting Proposal KP

**Require token**

- **Endpoint for Mahasiswa Deleting Proposal KP**
  - `DELETE /mahasiswa/delete/:id`

### Uploading Surat Pengantar KP

**Require token**

- **Endpoint for Dosen Uploading Surat Pengantar KP**
  - `POST /dosen/suratpengantar`

**Action:** Getting data file from the client, storing it in Amazon S3, and storing other data in the database.

### Retrieving Surat Pengantar

**Require token**

- **Endpoint for Mahasiswa Retrieving Surat Pengantar**
  - `GET /mahasiswa/suratpengantar`
  
- **Endpoint for Dosen Retrieving Surat Pengantar**
  - `GET /dosen/suratpengantar`

### Uploading Surat Pernyataan MBKM

**Require token**

- **Endpoint for Mahasiswa Uploading Surat Pernyataan MBKM**
  - `POST /mahasiswa/suratpernyataan`

**Action:** Getting data file from the client, storing it in Amazon S3, and storing other data in the database.

### Retrieving Surat Pernyataan Data

- **Endpoint for Dosen Retrieving Surat Pernyataan Data**
  - `GET /dosen/suratpernyataan`

- **Endpoint for Mahasiswa Retrieving Surat Pernyataan Data**
  - `GET /mahasiswa/suratpernyataan`

### Deleting Surat Pernyataan

- **Endpoint for Mahasiswa Deleting Surat Pernyataan**
  - `DELETE /mahasiswa/suratpernyataan`


## Features
- [ ] Mahasiswa can do registration and login
- [ ] Dosen can do registration if the NIP matches with one of NIP in NIPs Database, also dosen can Login
- [ ] Changing the password can be done by Mahasiswa and Dosen
- [ ] Mahasiswa can send Proposal KP, get status of Proposal KP, delete Proposal KP to Dosen who handle it
- [ ] Mahassiwa can send and delete MBKM Letter to Dosen who handle it
- [ ] Mahasiswa can send weekly Report of KP or MBKM to Dosen who handle it, get the report status of it, and delete it
- [ ] Dosen get All Proposal KP from his handled Mahasiswa and Dosen can approve or deny it
- [ ] Dosen can create and send the Surat Pengantar KP to Mahasiswa. All of Surat Pengantar can be seen by all mahasiswa if the are in same Major
- [ ] Dosen can retrieve all of MBKM Letter
- [ ] Dosen can approve or deny the weekly Report from mahasiswa
- [ ] Dosen can give some comments to the report
