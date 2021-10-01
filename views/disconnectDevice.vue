<template>
	<v-card class="disconnect">
                <v-tooltip>
                        <template #activator="data">
                                <v-btn @click.stop="disconnect" class="icon-btn" ref="reference">
                                        <img src="plugins/device.prueba/data/img/icons/disconnect.png" :alt="$t('DEVICE_DISCONNECT')" class="s24">
                                </v-btn>
                        </template>
                        <span>{{$t('DEVICE_DISCONNECT')}}</span>
                </v-tooltip>
        </v-card>
</template>

<script>
	export default {
        name: 'DisconnectDialog',
        methods: {
                disconnect ()
                {
                        /* Send the 'disconnect' tag */
                        this.$root.$emit ('submit', {
                                disconnect: 'disconnect'
                        });
                },
                esc()
                {
                        /* Emit the 'submit' signal from the child component to notify the parent that the dialog has to be closed */
                        this.$root.$emit('submit');
                }
        }
}
</script>