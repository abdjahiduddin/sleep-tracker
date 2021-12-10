# Sleep Tracker
Aplikasi web ini akan memenuhi kebutuhan pengguna dalam melacak pola tidur mereka, termasuk durasi dan waktu.
Pengguna dapat menambahkan, mengedit, atau menghapus entri tidur apa pun.
Frontend menggunakan Bootstrap 5 dan Backend menggunakan node.js dan express. Frontend dan Backend berkomunikasi menggunakan REST API.
Data user disimpan di MongoDB Atlas

## Web Stack
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
Request  : {
    username: "username",
    email: "alamat email",
    age: "Umur",
    password: "password",
    password-confirmation: "password-confirmation"
}
Response : {
    message: "User created",
    userId: "user id"
}
```

#### Verifikasi alamat email
```javascript
Endpoint : /auth/verify
Method   : POST
Request  : {
    token: "token verifikasi"
}
Response : {
    message: "Email verification success"
}
```

#### Login
```javascript
Endpoint : /auth/login
Method   : POST
Request  : {
    email: "alamat email",
    password: "password"
}
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
Endpoint : /sleep/history
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

#### Request user profile
```javascript
Endpoint : /sleep/profile
Method   : GET
Response : {
    message: "Profile found!!",
    username: "user name",
}
```

#### Menambahkan sleep entry baru
```javascript
Endpoint : /sleep/entry
Method   : POST
Request  : {
    sleep: "waktu tidur",
    wakeUp: "waktu bangun",
    tz: "timezone"
}
Response : {
      savedId: "Id sleep entry",
      message: "Entry saved",
}
```

#### Mengedit sleep entry
```javascript
Endpoint : /sleep/entry
Method   : PUT
Request  : {
    sleep: "waktu tidur",
    wakeUp: "waktu bangun",
    tz: "timezone",
    entryId: "Id entry yang akan diedit"
}
Response : {
      savedId: "Id sleep entry",
      message: "Entry edited",
    }
```

#### Menghapus sleep entry
```javascript
Endpoint : /sleep/entry/:entryId
Method   : PUT
Response : {
      message: "Entry deleted",
}
```