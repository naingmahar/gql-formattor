## GQL Formattor And Clean Unnecessary Generated GQL Query String

### For Personal

---

#### path key

    Path file: string

---

---

#### param key format

    key: {
        gql document name : del key,
    }

---

---

#### del key format

    key: {
        del key : Unnecessary gql string,
    }

---

---

#### Example

    key: {
        CreateUserDocument: "user",
    },
    del:{
        user:`user {
            _id
            createdAt
            updatedAt
        }`
    }



    GqlFormattor("Userservice",key,del)

---
