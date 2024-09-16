import axios, { type Method, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ref, type Ref } from 'vue'

type FetchData<T> = (
  url: string,
  method?: Method,
  config?: AxiosRequestConfig & { mapper?: (data: any) => T }
) => Promise<void>

type UseFetchReturnType<T> = {
  data: Ref<T | null>
  error: Ref<Error | null>
  isLoading: Ref<boolean>
  fetchData: FetchData<T>
}

export function useFetch<T>(): UseFetchReturnType<T> {
  const data: Ref<T | null> = ref(null)
  const error: Ref<Error | null> = ref(null)
  const isLoading: Ref<boolean> = ref(false)

  const fetchData: FetchData<T> = async (url: string, method = 'GET', config) => {
    error.value = null
    isLoading.value = true

    try {
      const res: AxiosResponse<T> = await axios.request({
        url,
        method,
        ...config
      })

      data.value = config?.mapper ? config.mapper(res.data) : res.data
    } catch (e) {
      if (e instanceof Error) {
        error.value = e
      }
    } finally {
      isLoading.value = false
    }
  }

  return { data, error, isLoading, fetchData }
}
