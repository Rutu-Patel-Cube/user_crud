<template>
  <v-container fluid>
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

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedUser.name"
                        label="User name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedUser.surname"
                        label="Surname"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedUser.email"
                        label="Email"
                        type="email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
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
                <v-btn color="blue darken-1" text @click="addUser">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.active="{ item }">
        <v-switch v-model="item.active" inset></v-switch>
      </template>
      <template v-slot:item.actions>
        <v-icon small class="mr-2"> mdi-pencil </v-icon>
        <v-icon small> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import EventServices from "@/services/EventServices.js";
export default {
  data: () => ({
    loading: false,
    dialog: false,
    dialogDelete: false,
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
      EventServices.getUsers().then(({ data }) => {
        if (data) {
          console.log("getUsers--", data);
          this.users = data;
        }
      });
    },

    close() {
      this.dialog = false;
      this.editedUser = Object.assign({}, this.defaultUser);
    },
    addUser() {
      EventServices.addUser(this.editedUser).then(({ data }) => {
        if (data) {
          console.log("addUser--", data);
          this.users.push(this.editedUser);
          this.close();
        }
      });
    },
  },
};
</script>