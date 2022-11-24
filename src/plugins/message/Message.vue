<script lang="ts" setup>
import { close, messages } from './logic'
import CloseIcon from '~icons/system-uicons/close'
import ErrorIcon from '~icons/ic/baseline-info'
import WarnIcon from '~icons/material-symbols/warning-rounded'
import SuccessIcon from '~icons/ep/success-filled'
import InfoIcon from '~icons/material-symbols/sms-failed'
</script>

<template>
  <teleport to="body">
    <transition-group
      tag="div"
      name="message"
      class="z-50 fixed w-full pointer-events-none top-0 left-0 right-0"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="message absolute left-1/2 transform -translate-x-1/2 flex items-center justify-between py-16px px-12px min-w-240px max-w-540px pointer-events-auto border-border border-1px border-t-0 border-solid rounded-b-md bg-bg-base text-base select-none cursor-pointer"
        @click="close(message.id)"
      >
        <div class="flex items-center">
          <span class="mr-4px flex items-center">
            <SuccessIcon v-if="message.type === 'success'" style="color: #66bb6a" />
            <WarnIcon v-else-if="message.type === 'warn'" style="color: #ffa000" />
            <ErrorIcon v-else-if="message.type === 'error'" style="color: #f44336" />
            <InfoIcon v-else class="text-deep transform translate-y-2px" />
          </span>
          <span class="break-all leading-snug text-size-14px">{{ message.content }}</span>
        </div>
        <CloseIcon class="text-lite flex-shrink-0 ml-8px text-size-20px" />
      </div>
    </transition-group>
  </teleport>
</template>

<style lang="less" scoped>
.message {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .1), 0 0px 0 0 rgba(0, 0, 0, .1);

  &-enter-from, &-leave-to {
    transform: translateX(-50%) translateY(calc(-100% - 2px));
  }
  &-enter-to, &-leave-from {
    transform: translateX(-50%) translateY(0);
  }
  &-enter-active, &-leave-active {
    transition: all 150ms ease-out;
  }
}
</style>
