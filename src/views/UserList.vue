<template>
  <v-container fluid>
    <v-snackbar
      v-model="snackbar"
      timeout="2000"
      :color="snackbarType"
      top
      centered
    >
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          <v-icon>fa fa-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="users"
      class="elevation-1 px-5"
      disable-pagination
      hide-default-footer
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Users</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Add User
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Add User</span>
              </v-card-title>
              <v-form @submit.prevent="addUser" v-model="valid" ref="form">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          :rules="[rules.required, rules.counter, rules.name]"
                          v-model="editedUser.name"
                          label="User name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          :rules="[rules.required, rules.counter, rules.name]"
                          v-model="editedUser.surname"
                          label="Surname"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          :rules="[rules.required, rules.email]"
                          v-model="editedUser.email"
                          label="Email"
                          type="email"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          :rules="[rules.required, rules.phone]"
                          v-model="editedUser.phone"
                          label="Phone number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-switch
                          v-model="editedUser.active"
                          label="Active"
                          inset
                        ></v-switch>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    type="submit"
                    :disabled="!valid"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this user?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteUserConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.active="{ item }">
        <v-switch v-model="item.active" inset></v-switch>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editUser(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteUser(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import EventServices from "@/services/EventServices.js";
export default {
  data: () => ({
    valid: false,
    loading: false,
    dialog: false,
    dialogDelete: false,
    timeout: 5000,
    snackbar: false,
    snackbarMessage: "",
    snackbarType: "",
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Surname", value: "surname" },
      { text: "Email", value: "email" },
      { text: "Phone", value: "phone" },
      { text: "Active", value: "active" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    users: [],
    editedIndex: -1,
    editedUser: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      active: "",
    },
    defaultUser: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      active: "",
    },
    rules: {
      required: (value) => !!value || "Required.",
      counter: (value) => (value && value.length >= 3) || "Min 3 characters",
      email: (value) => {
        const pattern = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
      phone: (value) => {
        const pattern = /^\d{10}$/;
        return pattern.test(value) || "Invalid phone number.";
      },
      name: (value) => {
        const pattern = /[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
        return pattern.test(value) || "Invalid name.";
      },
    },
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getUsers();
  },

  methods: {
    getUsers() {
      this.loading = true;
      EventServices.getUsers().then(({ data }) => {
        if (data) {
          console.log("getUsers--", data);
          this.users = data;
          this.loading = false;
        }
      });
    },
    deleteUser(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedUser = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteUserConfirm() {
      var deleteId = this.users[this.editedIndex].id;
      EventServices.deleteUser(deleteId).then(() => {
        this.users.splice(this.editedIndex, 1);
        this.closeDelete();
        this.snackbarType = "success";
        this.snackbarMessage = "User Deleted Successfully";
        this.snackbar = true;
      });
    },

    close() {
      this.dialog = false;
      this.editedUser = Object.assign({}, this.defaultUser);
      this.$refs.form.reset();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.editedUser = Object.assign({}, this.defaultUser);
      this.editedIndex = -1;
    },

    addUser() {
      EventServices.addUser(this.editedUser).then(({ data }) => {
        if (data) {
          console.log("addUser--", data);
          this.users.push(data);
          this.close();
          this.snackbarType = "success";
          this.snackbarMessage = "User Added Successfully";
          this.snackbar = true;
        }
      });
    },
    editUser(item) {
      this.$router.push({
        name: "UserUpdate",
        params: { id: item.id },
      });
    },
  },
};
</script>