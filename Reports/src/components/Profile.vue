<template>
    <div>
        Hello!  See text next. 
        {{ this.msg }}
    </div>
</template>

<script>
import store from '../store.js'

export default {
    name: 'Profile',
    props: ['msg'],
    data() {
        return {
            welcome: 'This is your profile'
        }
    },
    mounted() {
        if (this.msg) {
            this.welcome = this.msg    
        }

    }
}
</script>