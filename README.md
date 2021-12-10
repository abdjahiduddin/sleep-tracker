# Sleep Tracker
Live Preview </br>
https://simple-sleep-tracker.herokuapp.com/

Web Stack
- Bootstrap 5
- Node.js
- Express
- MongoDB Atlas

## Live Preview
Web ini telah dideploy di [heroku](https://www.heroku.com/) untuk mencoba secara langsung klik link berikut  <br/>
https://simple-sleep-tracker.herokuapp.com/

Anda dapat membuat akun baru, namun pada saat membuat akun baru sebaiknya menggunakan email yang valid, karena sistem akan mengirimkan email verifikasi. Jika email tidak di verifikasi maka user tidak akan bisa login <br/>
Anda juga dapat login menggunakan user berikut <br/>
user: john.doe@test.com <br/>
pass: 12345

## Fitur
- Login dan Signup
- Verifikasi email
- Proses authentikasi menggunakan JWT dan Cookie HTTP Only
- User dapat menambahkan, menghapus dan mengubah sleep entry
- User memasukkan waktu tidur dan waktu bangun kemudian sistem akan menghitung durasi tidur
- Menampilkan sleep entry 7 hari terakhir
- Menampilkan sleep entry berdasarkan bulan 
- Menampilkan semua sleep entry
- Menampilkan sleep entry dalam bentuk diagram garis
- Menampilkan daftar sleep entry dalam tabel
- Menampilkan rata-rata waktu tidur, waktu bangun dan durasi tidur
- Menampilkan jumlah hari durasi tidur yang kurang dari 6 jam
- Menampilkan jumlah hari durasi tidur yang lebih dari 8 jam
- Password yang tersimpan di database dienkripsi menggunakan package bcryptjs
- Email verifikasi dikirim menggunakan package nodemailer.
- Validasi dan sanitasi data yang dimasukkan user menggunakan package express-validator

## REST API

#### Membuat user baru
```javascript
Endpoint : /auth/signup
Method   : POST
Response : {
    message: "User created",
    userId: "user id"
}
```

#### Verifikasi alamat email
```javascript
Endpoint : /auth/verify
Method   : POST
Response : {
    message: "Email verification success"
}
```

#### Login
```javascript
Endpoint : /auth/login
Method   : POST
Response : {
      token: jwtToken,
      userId: "User id",
      expiresIn: 780000 
}
```

#### Logout
```javascript
Endpoint : /auth/logout
Method   : GET
Response : {
      message: "Credential deleted"
}
```

#### Request sleep entry 7 hari terakhir
```javascript
Endpoint : /sleep/last
Method   : GET
Response : {
    message: "Successful retrieve all data",
    userId: "user id",
    data: "data untuk diagram garis",
    lists: "data untuk tabel",
    sleepLessSix: "Jumlah hari durasi tidur yang kurang dari 6 jam",
    sleepMoreEight: "Jumlah hari durasi tidur yang lebih dari 8 jam",
    avgWakeUp: "Rata-rata waktu bangun",
    avgSleep: "Rata-rata waktu tidur",
    avgDuration: "Rata-rata durasi tidur"
}
```

#### Request sleep entry berdasarkan bulan
```javascript
Endpoint : /sleep/months/:month
Method   : GET
Response : {
    message: "Successful retrieve all data",
    userId: "user id",
    data: "data untuk diagram garis",
    lists: "data untuk tabel",
    sleepLessSix: "Jumlah hari durasi tidur yang kurang dari 6 jam",
    sleepMoreEight: "Jumlah hari durasi tidur yang lebih dari 8 jam",
    avgWakeUp: "Rata-rata waktu bangun",
    avgSleep: "Rata-rata waktu tidur",
    avgDuration: "Rata-rata durasi tidur"
}
```

#### Request semua sleep entry
```javascript
Endpoint : /sleep/months/:month
Method   : GET
Response : {
    message: "Successful retrieve all data",
    userId: "user id",
    data: "data untuk diagram garis",
    lists: "data untuk tabel",
    sleepLessSix: "Jumlah hari durasi tidur yang kurang dari 6 jam",
    sleepMoreEight: "Jumlah hari durasi tidur yang lebih dari 8 jam",
    avgWakeUp: "Rata-rata waktu bangun",
    avgSleep: "Rata-rata waktu tidur",
    avgDuration: "Rata-rata durasi tidur"
}
```

#### Menambahkan sleep entry baru
```javascript
Endpoint : /sleep/entry
Method   : POST
Response : {
      savedId: "Id sleep entry",
      message: "Entry saved",
}
```

#### Mengedit sleep entry
```javascript
Endpoint : /sleep/entry
Method   : PUT
Response : {
      savedId: "Id sleep entry",
      message: "Entry edited",
    }
```

#### Menghapus sleep entry
```javascript
Endpoint : /sleep/entry
Method   : PUT
Response : {
      message: "Entry deleted",
}
```