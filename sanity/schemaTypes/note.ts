import {defineType} from 'sanity'

export const note = defineType({
  name: 'note',
  title: 'Note',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
    },
    {
      name: 'position',
      title: 'Position',
      type: 'object',
      fields: [
        {
          name: 'x',
          title: 'X',
          type: 'number',
        },
        {
          name: 'y',
          title: 'Y',
          type: 'number',
        },
        {
          name: 'z',
          title: 'Z',
          type: 'number',
        },
      ],
    },
    {
      name: 'authorId',
      title: 'Author Firebase UID',
      type: 'string',
    },
    {
      name: 'boardId',
      title: 'Board ID',
      type: 'string',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
})
