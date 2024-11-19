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
              <br>
              Plateau Height: {{ rover.plateau?.height || 'N/A' }}
              <br>
              Plateau Width: {{ rover.plateau?.width || 'N/A' }}
            </v-card-text>
            <v-card-text>
              Current height:  {{ rover.currentHeight }}
              <br>
              Current width:  {{ rover.currentWidth }}
              <br>
              Direction: {{ getFullDirection(rover.direction) }}
            </v-card-text>
            <v-card-actions>
              <v-btn 
                color="primary" 
                @click="openCommandRoverDialog(rover)"
              >
                Give Command
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
            <span class="headline"> Command </span>
          </v-card-title>
          <v-card-text>
            <v-alert 
              type="info" 
              class="mb-4"
            >
              <p><strong>Command Guide:</strong></p>
              <ul>
                <li><strong>M</strong>: Move forward</li>
                <li><strong>L</strong>: Turn 90° left</li>
                <li><strong>R</strong>: Turn 90° right</li>
              </ul>
              Enter commands in sequence (e.g., <code>MMRML</code>).
            </v-alert>
            <v-text-field
              v-model="command"
              label="Enter Command"
              placeholder="e.g., MMRML"
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-btn 
              color="primary" 
              @click="submitCommand"
            >
              Execute Command
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
      plateau: {},
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
        .then(async (response) => {
          const rovers = response.data;
          const roversWithPlateau = await Promise.all(
            rovers.map(async (rover) => {
              if (rover.plateauId) {
                try {
                  const plateau = await this.fetchPlateau(rover.plateauId);
                  return { ...rover, plateau };
                } catch (error) {
                  console.error(`Error fetching plateau for rover ${rover.id}:`, error);
                  return { ...rover, plateau: null };
                }
              }
              return { ...rover, plateau: null };
            })
          );

          this.rovers = roversWithPlateau;
        })
        .catch((error) => {
          console.error('Error fetching rovers:', error);
        });
    },
    
    fetchPlateau(plateauId) {
    return axios
      .get(`http://localhost:3333/api/plateaus/${plateauId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`Error fetching plateau ${plateauId}:`, error);
        throw error; 
      });
    },

    openCommandRoverDialog(rover) {
      this.currentRoverId = rover.id;
      this.command = '';
      this.dialogVisible = true;
      this.errorMessage = '';
    },

    closeDialog() {
      this.dialogVisible = false;
      this.roverName = '';     
      this.command = '';       
      this.currentRoverId = null;
      this.errorMessage = '';
    },

    submitCommand() {
      if (!this.command.trim()) {
        this.errorMessage = 'Command cannot be empty!';
        return;
      }
      const currentRover = this.rovers.find(rover => rover.id === this.currentRoverId);
      if (!currentRover) {
        this.errorMessage = 'Rover not found!';
        return;
      }

      const commandData = {
        command: this.command,
        roverId: this.currentRoverId,
        plateauId: currentRover.plateau ? currentRover.plateau.id : null,
      };

      console.log('Command Data:', commandData);

      axios
        .post(`http://localhost:3333/api/plateau/${commandData.plateauId}/rover/${this.currentRoverId}/command`, commandData)
        .then((response) => {
          const updatedRover = response.data;
          const index = this.rovers.findIndex((rover) => rover.id === this.currentRoverId);
          if (index !== -1) {
            this.rovers[index] = { ...this.rovers[index], ...updatedRover };
          }
          this.closeDialog();
          this.fetchRovers();
        })
        .catch((error) => {
          console.error('Error executing command:', error);
          this.errorMessage = 'Error executing the command!';
        });
    },

    getFullDirection(direction) {
      const directionMap = {
        N: 'North',
        S: 'South',
        E: 'East',
        W: 'West',
      };
      return directionMap[direction] || 'Unknown';
    },
  },
}
</script>