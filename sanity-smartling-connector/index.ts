import {SanityClient} from '@sanity/client'
import {Schema} from '@sanity/types'
import {getDefaultBaseDocumentLevelConfig} from '../smartling-translations-tab/configuration/baseDocumentLevelConfig'
import {getBaseFieldLevelConfig} from '../smartling-translations-tab/configuration/baseFieldLevelConfig'

import {
  findLatestDraft,
  BaseDocumentDeserializer,
  BaseDocumentSerializer,
  BaseDocumentMerger,
  defaultStopTypes,
  customSerializers,
  Adapter,
  documentLevelPatch,
  fieldLevelPatch,
} from './../smartling-translations-tab'
import {SmartlingAdapter} from './adapter'

type ConfigOptions = {
  adapter: Adapter
  idStructure?: string
  secretsNamespace: string | null
  exportForTranslation: (id: string) => Promise<Record<string, any>>
  importTranslation: (
    id: string,
    localeId: string,
    document: string,
    idStructure?: 'subpath' | 'delimiter',
    baseLanguage?: string
  ) => Promise<void>
}

export const getDefaultDocumentLevelConfig = (
  schema: Schema,
  client: SanityClient
): ConfigOptions => {
  return getDefaultBaseDocumentLevelConfig(schema, client, SmartlingAdapter)
}

export const getDefaultFieldLevelConfig = (schema: Schema, client: SanityClient): ConfigOptions => {
  return getBaseFieldLevelConfig(schema, client, SmartlingAdapter)
}

export {
  findLatestDraft,
  documentLevelPatch,
  fieldLevelPatch,
  BaseDocumentDeserializer,
  BaseDocumentSerializer,
  BaseDocumentMerger,
  defaultStopTypes,
  customSerializers,
  SmartlingAdapter,
}
