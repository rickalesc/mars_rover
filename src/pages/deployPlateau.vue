<template>
  <v-app>
    <v-container>
      <v-row 
        v-for="plateau in plateaus" 
        :key="plateau.id" 
        class="mb-4"
      >
        <v-col cols="12">
          <v-card>
            <v-card-title>
              {{ plateau.name }}
            </v-card-title>
            <v-card-title>
              Width {{ plateau.width }} Kilometers
            </v-card-title>
            <v-card-title>
              Height {{ plateau.height }} Kilometers
            </v-card-title>
            <v-card-actions>
              <v-btn 
                color="primary"
                @click="goToPlateau(plateau.id)"
              >
                Select Plateau to Deploy
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      plateaus: [],
    };
  },
  mounted() {
    this.fetchPlateaus();
  },
  methods: {
    fetchPlateaus() {
      axios
        .get('http://localhost:3333/api/plateaus')
        .then(response => {
          this.plateaus = response.data;
        })
        .catch(error => {
          console.error('Error fetching plateaus:', error);
        });
    },
    goToPlateau(id) {
      this.$router.push(`/deploy/plateau/${id}/rover`);
    },
  },
};
</script>