import {getLocales} from './getLocales'
import {getTranslationTask} from './getTranslationTask'
import {createTask} from './createTask'
import {getTranslation} from './getTranslation'
import {Adapter} from '../../smartling-translations-tab/types'

export const SmartlingAdapter: Adapter = {
  getLocales,
  getTranslationTask,
  createTask,
  getTranslation,
}
