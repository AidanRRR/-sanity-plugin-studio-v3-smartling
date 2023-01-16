import {
  BaseDocumentSerializer,
  BaseDocumentDeserializer,
  LegacyBaseDocumentDeserializer,
  BaseDocumentMerger,
} from 'sanity-naive-html-serializer'
import {SanityDocument} from '@sanity/client'

import {findLatestDraft, findDocumentAtRevision, checkSerializationVersion} from './utils'
import {Schema, SanityClient} from 'sanity'
import {Adapter} from '../types'

export const getBaseFieldLevelConfig = (
  schemas: Schema,
  client: SanityClient,
  adapter: Adapter
) => {
  return {
    exportForTranslation: async (id: string) => {
      const doc = await findLatestDraft(id, client)
      const serialized = BaseDocumentSerializer(schemas).serializeDocument(doc, 'field')
      serialized.name = id
      return serialized
    },
    importTranslation: async (
      id: string,
      localeId: string,
      document: string,
      baseLanguage: string = 'en'
    ) => {
      const serializationVersion = checkSerializationVersion(document)
      let deserialized
      if (serializationVersion === '2') {
        deserialized = BaseDocumentDeserializer.deserializeDocument(document) as SanityDocument
      } else {
        deserialized = LegacyBaseDocumentDeserializer(schemas).deserializeDocument(
          document
        ) as SanityDocument
      }
      return fieldLevelPatch(id, deserialized, localeId, client, baseLanguage)
    },
    adapter,
    secretsNamespace: 'translationService',
  }
}

export const fieldLevelPatch = async (
  documentId: string,
  translatedFields: SanityDocument,
  localeId: string,
  client: SanityClient,
  baseLanguage: string = 'en'
) => {
  let baseDoc: SanityDocument
  if (translatedFields._rev && translatedFields._id) {
    baseDoc = await findDocumentAtRevision(translatedFields._id, translatedFields._rev, client)
  } else {
    baseDoc = await findLatestDraft(documentId, client)
  }

  const merged = BaseDocumentMerger.fieldLevelMerge(
    translatedFields,
    baseDoc,
    localeId,
    baseLanguage
  )

  await client.patch(baseDoc._id).set(merged).commit()
}
