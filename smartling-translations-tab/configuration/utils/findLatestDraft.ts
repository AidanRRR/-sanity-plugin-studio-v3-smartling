import {SanityDocument} from '@sanity/types'
import {SanityClient} from 'sanity'

const findLatestDraft = async (documentId: string, client: SanityClient) => {
  const query = `*[_id == $id || _id == $draftId]`
  const params = {id: documentId, draftId: `drafts.${documentId}`}
  return client
    .fetch(query, params)
    .then((docs: SanityDocument[]) => docs.find((doc) => doc._id.includes('draft')) ?? docs[0])
}

export default findLatestDraft
