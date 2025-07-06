import {defineType} from 'sanity'

export const note = defineType({
  name: 'note',
  type: 'document',
  title: 'Note',
  fields: [
    {name: 'title', type: 'string', title: 'Title'},
    {name: 'content', type: 'text', title: 'Content'},
    {
      name: 'position',
      title: 'Position',
      type: 'object',
      fields: [
        {name: 'x', type: 'number', title: 'X'},
        {name: 'y', type: 'number', title: 'Y'},
        {name: 'z', type: 'number', title: 'Z'},
      ],
    },
    {
      name: 'authorId',
      type: 'string',
      title: 'Author Firebase UID',
    },
    {
      name: 'boardId',
      type: 'string',
      title: 'Board ID',
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      initialValue: () => new Date().toISOString(),
    },
  ],
})
