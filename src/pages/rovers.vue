<template>
  <v-app>
    <v-container>
      <v-row class="mb-4">
        <v-col>
          <v-btn 
            color="primary" 
            @click="openAddRoverDialog"
          >
            Add Rover
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
        v-for="rover in rovers" 
        :key="rover.id" 
        class="mb-4"
      >
        <v-col cols="12">
          <v-card>
            <v-card-title>
              {{ rover.name }}
            </v-card-title>
            <v-card-subtitle>
              Fabrication: {{ formatDate(rover.created_at) }}
            </v-card-subtitle>
            <v-card-text>
              Status: {{ rover.status }}
            </v-card-text>
            <v-card-actions>
              <v-btn 
                color="primary" 
                @click="openUpdateRoverDialog(rover)"
              >
                Update
              </v-btn>
              <v-btn 
                color="error" 
                @click="deleteRover(rover.id)"
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
            <span class="headline">{{ isUpdate ? 'Update Rover' : 'Add Rover' }}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="roverName"
              label="Rover Name"
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-btn 
              color="primary" 
              @click="submitRover"
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
      rovers: [],
      dialogVisible: false,
      roverName: '',
      currentRoverId: null,
      isUpdate: false,
      errorMessage: '',
    };
  },
  mounted() {
    this.fetchRovers();
  },
  methods: {
    fetchRovers() {
      axios
        .get('http://localhost:3333/api/rovers')
        .then(response => {
          this.rovers = response.data;
        })
        .catch(error => {
          console.error('Error fetching rovers:', error);
        });
    },

    openAddRoverDialog() {
      this.roverName = '';
      this.isUpdate = false;
      this.dialogVisible = true;
      this.errorMessage = '';
    },

    openUpdateRoverDialog(rover) {
      this.roverName = rover.name;
      this.currentRoverId = rover.id;
      this.isUpdate = true;
      this.dialogVisible = true;
      this.errorMessage = '';
    },

    submitRover() {
      if (!this.roverName.trim()) {
        this.errorMessage = 'Rover name is required!';
        return;
      }

      const roverData = {
        name: this.roverName,
      };

      if (this.isUpdate) {
        axios
          .post(`http://localhost:3333/api/rovers/${this.currentRoverId}`, roverData)
          .then(response => {
            const index = this.rovers.findIndex(rover => rover.id === this.currentRoverId);
            if (index !== -1) {
              this.rovers[index] = { ...this.rovers[index], ...response.data };
            }
            this.closeDialog();
            this.fetchRovers();
          })
          .catch(error => {
            console.log(error);
            console.error('Error updating rover:', error);
          });
      } else {
        axios
          .post('http://localhost:3333/api/rovers', roverData)
          .then(response => {
            this.rovers.push(response.data);
            this.closeDialog();
          })
          .catch(error => {
            if (error.response && error.response.data) {
              this.errorMessage = error.response.data.error || 'Error adding rover';
            } else {
              this.errorMessage = 'Error adding rover';
            }
            console.error('Error adding rover:', error);
          });
      }
    },

    deleteRover(roverId) {
      axios
        .delete(`http://localhost:3333/api/rovers/${roverId}`)
        .then(() => {
          this.rovers = this.rovers.filter(rover => rover.id !== roverId);
        })
        .catch(error => {
          console.error('Error deleting rover:', error);
        });
    },

    closeDialog() {
      this.dialogVisible = false;
      this.roverName = '';
      this.currentRoverId = null;
      this.errorMessage = '';
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US');
    },
  },
};
</script>