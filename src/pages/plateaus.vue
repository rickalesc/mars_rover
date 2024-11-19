<template>
  <v-app>
    <v-container>
      <v-row class="mb-4">
        <v-col>
          <v-btn 
            color="primary" 
            @click="openAddPlateauDialog"
          >
            Add Plateau
          </v-btn>
        </v-col>
      </v-row>
      <v-alert
        v-if="errorMessage"
        type="error"
        dismissible
        @input="errorMessage = ''"
      >
        {{ errorMessage }}
      </v-alert>

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
            <v-card-subtitle>
              Founded: {{ formatDate(plateau.created_at) }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn 
                color="primary" 
                @click="openUpdatePlateauDialog(plateau)"
              >
                Update
              </v-btn>
              <v-btn 
                color="error" 
                @click="deletePlateau(plateau.id)"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog 
        v-model="dialogVisible" 
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{ isUpdate ? 'Update Plateau' : 'Add Plateau' }}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="plateauName"
              label="Plateau Name"
              required
            />
          </v-card-text>
          <v-card-text>
            <v-text-field
              v-model="plateauWidth"
              label="Plateau width in Kilometers"
              type="number"
              required
            />
          </v-card-text>
          <v-card-text>
            <v-text-field
              v-model="plateauHeight"
              label="Plateau height in Kilometers"
              type="number"
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-btn 
              color="primary" 
              @click="submitPlateau"
            >
              {{ isUpdate ? 'Update' : 'Add' }}
            </v-btn>
            <v-btn 
              text 
              @click="closeDialog"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      plateaus: [],
      dialogVisible: false,
      plateauName: '',
      plateauWidth: '',
      plateauHeight: '',
      currentPlateauId: null,
      isUpdate: false,
      errorMessage: '',
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

    openAddPlateauDialog() {
      this.plateauName = '';
      this.plateauWidth = '';
      this.plateauHeight = '';
      this.isUpdate = false;
      this.dialogVisible = true;
      this.errorMessage = '';
    },

    openUpdatePlateauDialog(plateau) {
      this.plateauName = plateau.name;
      this.currentPlateauId = plateau.id;
      this.plateauHeight = plateau.height;
      this.plateauWidth = plateau.width;
      this.isUpdate = true;
      this.dialogVisible = true;
      this.errorMessage = '';
    },

    submitPlateau() {
      if (!this.plateauName.trim()) {
        this.errorMessage = 'Plateau name is required!';
        return;
      }

      if (!this.plateauWidth || isNaN(this.plateauWidth) || this.plateauWidth <= 0) {
        this.errorMessage = 'Width must be a positive number!';
        return;
      }

      if (!this.plateauHeight || isNaN(this.plateauHeight) || this.plateauHeight <= 0) {
        this.errorMessage = 'Height must be a positive number!';
        return;
      }

      const plateauData = {
        name: this.plateauName,
        height: this.plateauHeight,
        width: this.plateauWidth,
      };

      if (this.isUpdate) {
        axios
          .post(`http://localhost:3333/api/plateaus/${this.currentPlateauId}`, plateauData)
          .then(response => {
            const index = this.plateaus.findIndex(plateau => plateau.id === this.currentPlateauId);
            if (index !== -1) {
              this.plateaus[index] = { ...this.plateaus[index], ...response.data };
            }
            this.closeDialog();
            this.fetchPlateaus();
          })
          .catch(error => {
            console.error('Error updating plateau:', error);
          });
      } else {
        axios
          .post('http://localhost:3333/api/plateaus', plateauData)
          .then(response => {
            this.plateaus.push(response.data);
            this.closeDialog();
          })
          .catch(error => {
            console.error('Error adding plateau:', error);
          });
      }
    },

    deletePlateau(plateauId) {
      axios
        .delete(`http://localhost:3333/api/plateaus/${plateauId}`)
        .then(() => {
          this.plateaus = this.plateaus.filter(plateau => plateau.id !== plateauId);
        })
        .catch(error => {
          console.error('Error deleting plateau:', error);
        });
    },

    closeDialog() {
      this.dialogVisible = false;
      this.plateauName = '';
      this.plateauWidth = '';
      this.plateauHeight = '';
      this.currentPlateauId = null;
      this.errorMessage = '';
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US');
    },
  },
};
</script>