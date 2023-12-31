<template>
  <teleport to="body">
    <div
      v-if="state.isActive"
      @click="handleModalToggle({ status: false })"
      class="fixed top-0 left-0 z--50 flex items-center justify-center w-full h-full bg-black/50"
    >
      <div class="fixed mx-10" :class="state.width" @click.stop>
        <div
          class="flex flex-col overflow-hidden bg-white rounded-lg animate__animated animate__fadeInDown animate__faster"
        >
          <div class="flex flex-col px-12 py-10 bg-white">
            <component :is="state.component" v-bind="state.props" />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import {
  reactive,
  onMounted,
  onBeforeUnmount,
  defineAsyncComponent,
} from 'vue';
import useModal from '../../hooks/useModal';

const DEFAULT_WIDTH = 'w-3/4 lg:w-1/3';

const ModalLogin = defineAsyncComponent(() =>
  import('../LoginModal/LoginModal.vue')
);
const ModalCreateAccount = defineAsyncComponent(() =>
  import('../CreateAccountModal/CreateAccountModal.vue')
);

export default {
  components: {
    ModalLogin,
    ModalCreateAccount,
  },

  setup() {
    const modal = useModal();

    const state = reactive({
      isActive: false,
      component: {},
      props: {},
      width: DEFAULT_WIDTH,
    });

    onMounted(() => {
      modal.listen(handleModalToggle);
    });

    onBeforeUnmount(() => {
      modal.off(handleModalToggle);
    });

    function handleModalToggle(payload) {
      if (payload.status) {
        state.component = payload.component;
        state.props = payload.props;
        state.width = payload.width ?? DEFAULT_WIDTH;
      } else {
        state.component = {};
        state.props = {};
        state.width = DEFAULT_WIDTH;
      }

      state.isActive = payload.status;
    }

    return {
      state,
      handleModalToggle,
    };
  },
};
</script>
