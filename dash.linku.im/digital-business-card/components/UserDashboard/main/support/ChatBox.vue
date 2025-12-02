<template>
  <div>

کد رایچت

  </div>
</template>

<script>
export default {
  name: 'ChatBox',
  data() {
    return {
      message: ''
    }
  },
  methods: {
    sendMessage() {
      if (this.message.trim()) {
        alert('پیام شما ارسال شد: ' + this.message)
        this.message = ''
      }
    }
  }
}
</script>
