import dayjs from "dayjs"

export const formatDate = (d: string | Date) => dayjs(d).format('MMM D, YYYY')
