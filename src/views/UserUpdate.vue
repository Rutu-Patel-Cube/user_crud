<template>
  <v-container fluid>
    <div>
      <v-breadcrumbs :items="items">
        <template v-slot:divider>
          <v-icon>mdi-forward</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <v-form @submit.prevent="updateUser" v-model="valid" ref="form">
      <v-card flat class="px-7">
        <v-card-title>
          <h1 class="display-1">Update User</h1>
        </v-card-title>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              :rules="[rules.required, rules.counter, rules.name]"
              v-model="user.name"
              label="User name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              :rules="[rules.required, rules.counter, rules.name]"
              v-model="user.surname"
              label="Surname"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              :rules="[rules.required, rules.email]"
              v-model="user.email"
              label="Email"
              type="email"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              :rules="[rules.required, rules.phone]"
              v-model="user.phone"
              label="Phone number"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-switch v-model="user.active" label="Active" inset></v-switch>
          </v-col>
        </v-row>
        <v-divider />
        <!-- <v-card-actions> -->
        <v-btn
          color="primary"
          type="submit"
          :disabled="!valid || btnLoading"
          :loading="btnLoading"
          class="mt-5"
          >Save</v-btn
        >
        <!-- </v-card-actions> -->
      </v-card>
    </v-form>
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
  </v-container>
</template>


<script>
import EventServices from "@/services/EventServices.js";
export default {
  data() {
    return {
      userId: "",
      user: {
        name: "",
        surname: "",
        email: "",
        phone: "",
        active: "",
      },
      timeout: 5000,
      snackbar: false,
      snackbarMessage: "",
      snackbarType: "",
      selectedStatus: "",
      items: [
        {
          text: "Users",
          disabled: false,
          href: "/",
        },
        {
          text: "Update User",
          disabled: true,
          href: "UserUpdate",
        },
      ],
      success: false,
      valid: false,
      btnLoading: false,
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
    };
  },
  mounted() {
    console.log("this.$route.params", this.$route.params);
    if (!this.$route.params.id) {
      this.$router.push({ name: "UserList" });
    } else {
      this.userId = this.$route.params.id;
      console.log("this.userId--", this.userId);
      this.getUser();
    }
  },
  methods: {
    getUser() {
      EventServices.getUser(this.userId).then(({ data }) => {
        if (data) {
          console.log("getUser--", data);
          this.user = data;
        }
      });
    },
    updateUser() {
      console.log("in updateUser--", this.userId, this.user);
      this.btnLoading = true;
      EventServices.updateUser(this.userId, this.user).then(({ data }) => {
        if (data) {
          console.log("updateUser--", data);
          this.snackbarType = "success";
          this.snackbarMessage = "User Updated Successfully";
          this.snackbar = true;
          this.btnLoading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>