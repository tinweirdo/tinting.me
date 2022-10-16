<script lang="ts" setup>
import { useRouter } from 'vue-router'

const props = defineProps<{ to: string }>()

const router = useRouter()

router.replace(props.to)
</script>
