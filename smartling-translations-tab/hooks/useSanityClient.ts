import {useMemo} from 'react'
import {useClient} from 'sanity'
import {apiVersion} from '../../../../constants'

export function useSanityClient() {
  const client = useClient({apiVersion})
  return useMemo(() => client, [client])
}
