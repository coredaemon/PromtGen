import type { PresetDefinition } from '@/entities/prompt-template/types'

export type PresetSearchExtra = Pick<
  PresetDefinition,
  | 'searchTerms'
  | 'phrases'
  | 'useCases'
  | 'tags'
  | 'searchGroup'
  | 'priority'
  | 'relatedPresetIds'
>

/**
 * Дополнительные поля поиска по id пресета (без правки гигантского presets.ts).
 */
export const PRESET_SEARCH_META: Record<string, PresetSearchExtra> = {
  'life-posting-text': {
    searchTerms: [
      'авито',
      'олх',
      'продажа',
      'продать',
      'продам',
      'куплю',
      'объявление',
      'объявления',
      'вещь',
      'товар',
      'перепродажа',
      'маркетплейс',
      'барахолка',
    ],
    phrases: [
      'объявление на авито',
      'описание товара для перепродажи',
      'продам вещь',
      'текст для объявления',
    ],
    searchGroup: 'продажа',
    tags: ['объявление', 'маркетплейс'],
    relatedPresetIds: ['life-casual-message', 'work-polite-decline'],
    priority: 3,
  },
  'work-polite-decline': {
    searchTerms: [
      'отказ',
      'отказать',
      'откажусь',
      'не хочу',
      'не могу',
      'перенос',
      'перенести',
      'перенесем',
      'отмена',
      'отменить',
      'опоздаю',
      'опоздание',
      'не смогу прийти',
      'не приду',
      'вежливо',
    ],
    phrases: [
      'вежливо отказать',
      'перенести встречу',
      'отменить планы',
      'не смогу прийти',
    ],
    searchGroup: 'отказ_перенос',
    relatedPresetIds: ['work-awkward-reply', 'life-casual-message'],
    priority: 4,
  },
  'life-casual-message': {
    searchTerms: [
      'учитель',
      'училка',
      'школа',
      'классный',
      'воспитатель',
      'сад',
      'детсад',
      'ребенок',
      'ребёнок',
      'не придет',
      'не придёт',
      'опоздает',
      'сосед',
      'соседям',
      'домовой',
      'чат дома',
      'арендодатель',
      'аренда',
      'квартира',
      'жк',
      'сообщение',
      'написать',
    ],
    phrases: [
      'написать учителю что ребенок не придет',
      'сообщение воспитателю',
      'ребенка заберет другой человек',
      'сообщение соседям',
      'текст для домового чата',
      'сообщение арендодателю',
    ],
    searchGroup: 'быт_сообщения',
    relatedPresetIds: ['work-business-letter', 'life-posting-text'],
    priority: 3,
  },
  'work-business-letter': {
    searchTerms: ['письмо', 'служебная', 'коллегам', 'клиентам', 'перенос встречи'],
    phrases: ['деловое письмо', 'сообщение на работе'],
    searchGroup: 'работа_коммуникация',
    relatedPresetIds: ['work-polite-decline', 'work-request-reminder'],
  },
  'work-self-presentation': {
    searchTerms: [
      'резюме',
      'собеседование',
      'фото',
      'портрет',
      'аватарка',
      'аватар',
      'работа',
      'вакансия',
      'отклик',
      'о себе',
    ],
    phrases: [
      'фото для резюме',
      'деловой портрет',
      'самопрезентация',
      'текст о себе',
    ],
    searchGroup: 'работа_самопрезентация',
    relatedPresetIds: ['work-vacancy-application', 'work-thank-you-followup'],
    priority: 2,
  },
  'work-vacancy-application': {
    searchTerms: [
      'вакансия',
      'отклик',
      'резюме',
      'сопроводительное',
      'трудоустройство',
      'работа',
    ],
    phrases: ['отклик на вакансию', 'сопроводительное письмо'],
    searchGroup: 'работа_самопрезентация',
    relatedPresetIds: ['work-self-presentation', 'work-feedback-request'],
  },
  'text-summary': {
    searchTerms: [
      'сжать',
      'изложение',
      'пересказ',
      'статья',
      'текст длинный',
      'тезисы',
      'конспект',
    ],
    phrases: [
      'кратко пересказать текст',
      'сделать конспект статьи',
      'резюме текста статьи',
    ],
    tags: ['суммаризация'],
    priority: 1,
  },
  'work-explain-delay': {
    searchTerms: ['задержка', 'сроки', 'не успеваю', 'проблема по работе'],
    phrases: ['опоздаю с задачей', 'сорвался дедлайн'],
    searchGroup: 'работа_сроки',
    relatedPresetIds: ['work-status-update', 'work-polite-decline'],
  },
  'work-feedback-request': {
    searchTerms: ['отзыв', 'обратная связь', 'фидбек', 'оценка', 'комментарии'],
    phrases: ['попросить отзыв', 'обратная связь по работе'],
    searchGroup: 'работа_обратная_связь',
    relatedPresetIds: ['work-awkward-reply', 'work-group-announcement'],
  },
  'work-awkward-reply': {
    searchTerms: ['ответить', 'неловко', 'претензия', 'конфликт'],
    searchGroup: 'работа_сложный_ответ',
    relatedPresetIds: ['work-polite-decline', 'work-align-expectations'],
  },
  'life-difficult-conversation-prep': {
    searchTerms: ['разговор', 'сложный', 'конфликт', 'границы'],
    phrases: ['как сказать что не хочу', 'трудный разговор'],
    searchGroup: 'быт_разговор',
    relatedPresetIds: ['work-polite-decline', 'life-casual-message'],
  },
  'life-trip-outing-checklist': {
    searchTerms: ['поездка', 'сборы', 'чемодан', 'в отпуск'],
    searchGroup: 'путешествия',
  },
  'learn-explain-zero': {
    searchTerms: ['учеба', 'объясни', 'новичок', 'с нуля', 'школа', 'экзамен'],
    searchGroup: 'обучение',
    relatedPresetIds: ['learn-study-plan', 'learn-topic-steps'],
  },
  'life-plain-explanation': {
    searchTerms: [
      'объяснить',
      'простыми словами',
      'понятно',
      'разжевать',
      'упростить',
      'пересказать',
    ],
    phrases: [
      'объясни простыми словами',
      'сделай понятнее',
      'переведи на нормальный язык',
    ],
    useCases: [
      'объяснить человеку простыми словами',
      'объяснить сложную тему простыми словами',
      'объясни как обычному человеку',
    ],
    searchGroup: 'понятные объяснения',
  },
}

/** Быстрые подсказки под поиском (подставляют запрос). */
export const PRESET_QUICK_SEARCH_CHIPS: string[] = [
  'Продажа',
  'Перенос',
  'Учителю',
  'Отказ',
  'Соседям',
  'Отзыв',
]

/** «Популярные» запросы для пустого состояния и подсказок. */
export const POPULAR_PRESET_SEARCHES: string[] = [
  'объявление',
  'фото для резюме',
  'перенос',
  'отзыв',
  'соседям',
  'отказ',
]

/** Заготовки для блока «ничего не найдено» (ссылки в редактор). */
export const EMPTY_STATE_SUGGESTION_PRESET_IDS: string[] = [
  'life-posting-text',
  'work-self-presentation',
  'life-casual-message',
  'work-polite-decline',
]
