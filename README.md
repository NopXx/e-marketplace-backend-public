# e-marketplace-backend 🛍️

<h1 align="center">final project</h1>

# Get Started 🚀

## 🟢NodeJS + 🐬MySql + 🔑Jwt

```javascript
npm i
```

## `API Rote`

<details>
<summary>api/auth</summary>

```javascript
---------------------
POST /sign-up {
    "f_name":
    "l_name":
    "username":
    "password":
    "tel":
}
----------------------
POST /login {
    "username":
    "password":
}
------------------------
GET /getuser {
    "f_name": "nop",
    "role_id": 2,
    "role_name": "admin",
    "user_id": 5,
    "iat": 1670055391,
    "exp": 1670058991
}

```

</details>

<details>
<summary>api/userrole</summary>

```javascript
---------------------
GET /userrole {
   "data": [
        {
            "user_id": 5,
            "role_id": 2,
            "role_name": "admin"
        },
        {
            "user_id": 6,
            "role_id": 1,
            "role_name": "user"
        }
    ],
    "total": 2
}
----------------------
GET /userrole/:user_id {
    "data": [
        {
            "user_id": 6,
            "role_id": 1,
            "role_name": "user"
        }
    ],
    "total": 1
}
------------------------
PATCH /userrole/:user_id {
    "role_id": 2,
    "user_role_id": 3
}

```

</details>

<details>
<summary>api/useradd</summary>

```javascript
---------------------
GET /useradd {
   "data": [
        {
            "user_a_id": 2,
            "user_id": 5,
            "address_title": "บ้าน",
            "address": "บ้านเลขที",
            "sub_district": "ตำบล",
            "district": "อำเภอ",
            "province": "จังหวัด",
            "tel": "1234",
            "status": 1
        }
    ],
    "total": 1
}
----------------------
GET /useradd/:user_a_id {
    "data": [
        {
            "user_a_id": 2,
            "user_id": 5,
            "address_title": "บ้าน",
            "address": "บ้านเลขที",
            "sub_district": "ตำบล",
            "district": "อำเภอ",
            "province": "จังหวัด",
            "tel": "1234",
            "status": 1
        }
    ]
}
------------------------
POST /useradd {
    "title": "ที่ทำงาน",
    "address": "บ้านเลขที",
    "sub_district": "ตำบล",
    "district": "อำเภอ",
    "province": "จังหวัด",
    "tel": "1234",
}
------------------------
PATCH /useradd/:user_a_id {
    "title": "ที่ทำงาน",
    "address": "บ้านเลขที",
    "sub_district": "ตำบล",
    "district": "อำเภอ",
    "province": "จังหวัด",
    "tel": "1234",
}
------------------------
DELETE /useradd/:user_a_id {
    "message": "delete succeeded"
}

```

</details>

<details>
<summary>api/otp</summary>

```javascript
---------------------
POST /req-otp {
    "user_id": 2,
    "tel": 1234,
    "user_role_id": 3
}
----------------------
POST /ver-otp {
    "user_id": 2,
    "otp": 1234,
    "user_role_id": 3
}

```

</details>

<details>
<summary>api/user</summary>

```javascript
---------------------
// getuser full
GET /user {
    "data": [
        {
            "user_id": 5,
            "f_name": "nop",
            "l_name": "kh",
            "username": "admin",
            "password": "1234",
            "created_at": "2022-12-13T05:17:11.000Z",
            "updated_at": null,
            "tel": "123456",
            "last_login": "2022-12-16T14:29:32.000Z"
        }
    ]
}
----------------------
// get user all role admin
GET /user/all {
    "data": [
        {
            "user_id": 5,
            "f_name": "nop",
            "l_name": "kh",
            "username": "admin",
            "password": "1234",
            "created_at": "2022-12-13T05:17:11.000Z",
            "updated_at": null,
            "tel": "123456",
            "last_login": "2022-12-16T14:29:32.000Z"
        },
        {
            "user_id": 6,
            "f_name": "nop2",
            "l_name": "kh2",
            "username": "user1",
            "password": "1234",
            "created_at": "2022-12-14T07:15:31.000Z",
            "updated_at": "2022-12-16T14:48:52.000Z",
            "tel": "1234567",
            "last_login": "2022-12-15T08:03:27.000Z"
        }
    ],
    "total": 2
}

---------------------
// getuser by id role admin
GET /user/:user_id {
     "data": [
        {
            "user_id": 6,
            "f_name": "nop2",
            "l_name": "kh2",
            "username": "user1",
            "password": "1234",
            "created_at": "2022-12-14T07:15:31.000Z",
            "updated_at": "2022-12-16T14:48:52.000Z",
            "tel": "1234567",
            "last_login": "2022-12-15T08:03:27.000Z"
        }
    ]
}

---------------------
// update by id
PATCH /user/:user_id {
     "f_name": "nop2",
     "l_name": "kh2",
     "username": "user2",
     "password": "1234"
}

---------------------
// delete by id
DELETE /user/:user_id {
    "message": "delete succeeded"
}
```

</details>
