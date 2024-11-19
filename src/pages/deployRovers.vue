<template>
  <v-app>
    <v-container>
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
            <v-card-text>
              Status: {{ rover.status }}
            </v-card-text>
            <v-card-actions>
              <v-btn 
                color="primary" 
                @click="openDeployDialog(rover)"
              >
                Deploy Rover
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog 
      v-model="deployDialogVisible" 
      max-width="500px"
    >
      <v-card>
        <v-card-title>Deploy Rover</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="width"
              label="Enter Width"
              type="number"
              :rules="[rules.required]"
            />
            <v-text-field
              v-model="height"
              label="Enter Height"
              type="number"
              :rules="[rules.required]"
            />
            <v-select
              v-model="direction"
              :items="directions"
              label="Select Direction"
              :rules="[rules.required]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn 
            color="primary" 
            @click="submitDeploy"
          >
            Deploy
          </v-btn>
          <v-btn 
            color="secondary" 
            @click="closeDeployDialog"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  props: ['plateauId'],
  data() {
    return {
      rovers: [],
      currentRover: null,
      deployDialogVisible: false,
      width: '',
      height: '',
      direction: null,
      directions: ['N', 'E', 'S', 'W'],
      rules: {
        required: value => !!value || 'Field is required',
      },
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
    openDeployDialog(rover) {
      this.currentRover = rover;
      this.deployDialogVisible = true;
    },
    closeDeployDialog() {
      this.deployDialogVisible = false;
      this.width = '';
      this.height = '';
      this.direction = null;
      this.currentRover = null;
    },
    submitDeploy() {
      if (!this.$refs.form.validate()) return;

      const apiEndpoint = `http://localhost:3333/api/plateau/${this.plateauId}/rover/${this.currentRover.id}/deploy`;
      const payload = {
        width: this.width,
        height: this.height,
        direction: this.direction,
        command: 'Deploy'
      };

      axios
        .post(apiEndpoint, payload)
        .then(response => {
          console.log('Rover deployed successfully:', response.data);
          this.closeDeployDialog();
          this.fetchRovers();
        })
        .catch(error => {
          console.error('Error deploying rover:', error);
        });
    },
  },
};
</script>