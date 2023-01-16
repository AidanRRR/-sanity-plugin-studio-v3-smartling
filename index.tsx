import {ThemeProvider, ToastProvider, Stack, Text, Layer, Box, Card} from '@sanity/ui'
import {SanityClient, SanityDocument} from 'sanity'
import {useMemo} from 'react'
import {randomKey} from '@sanity/util/content'
import {TranslationContext} from './smartling-translations-tab/components/TranslationContext'
import {TranslationView} from './smartling-translations-tab/components/TranslationView'
import {useSanityClient} from './smartling-translations-tab/hooks/useSanityClient'
import {getSmartlingSecrets} from './getSmartlingSecrets'

type config = {
  baseLanguage: string
  importTranslation: (
    id: string,
    localeId: string,
    doc: Record<string, any>,
    client: SanityClient,
    _idStructure: any,
    baseLanguage?: string
  ) => Promise<void>
  idStructure?: 'subpath' | 'delimiter'
  exportForTranslation: (id: string) => Promise<Record<string, any>>
}

type Props = {
  document: {
    displayed: SanityDocument
  }
  options: {
    docConfig: config
    fieldConfig: config
    context: any
  }
  schemaType: any
}

export function Smartling(props: Props) {
  const {displayed} = props.document
  const {schemaType} = props
  const {docConfig, fieldConfig} = props.options
  const client = useSanityClient()

  const documentId =
    displayed && displayed._id ? (displayed._id.split('drafts.').pop() as string) : ''

  const documentLocalisationType: 'field' | 'document' = schemaType?.i18n ? 'document' : 'field'
  const usedConfig = documentLocalisationType === 'document' ? docConfig : fieldConfig

  const {errors, importTranslation, exportForTranslation} = useMemo(() => {
    let allErrors = []

    const importTranslationFunc = usedConfig.importTranslation
    if (!importTranslationFunc) {
      allErrors.push({
        key: randomKey(12),
        text: (
          <>
            You need to provide an <code>importTranslation</code> function. See documentation.
          </>
        ),
      })
    }

    const importTranslation = (localeId: string, doc: Record<string, any>) => {
      const baseLanguage = usedConfig.baseLanguage
      const idStructure = usedConfig.idStructure

      return importTranslationFunc(documentId, localeId, doc, client, idStructure, baseLanguage)
    }

    const exportTranslationFunc = usedConfig.exportForTranslation
    if (!exportTranslationFunc) {
      allErrors.push({
        key: randomKey(12),
        text: (
          <>
            You need to provide an <code>exportForTranslation</code> function. See documentation.
          </>
        ),
      })
    }

    const exportForTranslation = (id: string) => {
      return exportTranslationFunc(id)
    }

    return {errors: allErrors, importTranslation, exportForTranslation}
  }, [usedConfig, documentId])

  const {adapter, baseLanguage, workflowOptions, localeIdAdapter, secretsNamespace} =
    usedConfig as any
  const hasErrors = errors.length > 0

  const secrets = getSmartlingSecrets()

  if (!secrets.organization || !secrets.project || !secrets.secret) {
    return (
      <ThemeProvider>
        <Box padding={4}>
          <Card tone="caution" padding={[2, 3, 4, 4]} shadow={1} radius={2}>
            <Text>
              Cant find secrets for your translation service. Did you add them in a{' '}
              <code>.env</code> file? See <code>.env.example</code>
            </Text>
          </Card>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <Box padding={4}>
        <Layer>
          <ToastProvider paddingY={7}>
            {hasErrors && (
              <Stack space={3}>
                {errors.map((error) => (
                  <Card key={error.key} tone="caution" padding={[2, 3, 4, 4]} shadow={1} radius={2}>
                    <Text>{error.text}</Text>
                  </Card>
                ))}
              </Stack>
            )}
            {!hasErrors && (
              <TranslationContext.Provider
                value={{
                  documentId,
                  secrets,
                  importTranslation,
                  exportForTranslation,
                  adapter,
                  baseLanguage,
                  workflowOptions,
                  localeIdAdapter,
                  documentLocalisationType,
                }}
              >
                <TranslationView />
              </TranslationContext.Provider>
            )}
          </ToastProvider>
        </Layer>
      </Box>
    </ThemeProvider>
  )
}
