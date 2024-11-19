<template>
  <v-app>
    <!-- Left Side Menu -->
    <v-navigation-drawer 
      app 
      clipped 
      width="200"
    >
      <v-list dense>
        <v-list-item>
          <v-img 
            class="mb-4" 
            height="150" 
            src="@/assets/logo.png"
          />
        </v-list-item>
        <v-list-item 
          to="/explore" 
          height="75"
        >
          <v-list-item-content>
            <v-list-item-title>Explore</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item 
          to="/deploy" 
          height="75"
        >
          <v-list-item-content>
            <v-list-item-title>Deploy</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item 
          to="/plateaus" 
          height="75"
        >
          <v-list-item-content>
            <v-list-item-title>Plateaus</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item 
          to="/rovers" 
          height="75"
        >
          <v-list-item-content>
            <v-list-item-title>Rovers</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>

</style>