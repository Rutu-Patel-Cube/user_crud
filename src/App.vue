<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app width="200">
      <h4 class="text-uppercase mb-n8 mt-5 ml-5">User CRUD</h4>
      <v-list dense>
        <v-list-item class="px-2 text-center"> </v-list-item>
        <v-divider></v-divider>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-clipboard-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="primary--text">
              Dashboard
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="primary--text">
              Users
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group></v-list
      >
    </v-navigation-drawer>

    <v-app-bar app color="white">
      <v-icon v-if="drawer" class="mr-5" @click="drawer = !drawer">
        mdi-page-first
      </v-icon>
      <v-icon v-else-if="!drawer" class="mr-5" @click="drawer = !drawer">
        mdi-page-last
      </v-icon>
    </v-app-bar>

    <v-main app>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: "App",

  data: () => ({
    drawer: true,
  }),
};
</script>
