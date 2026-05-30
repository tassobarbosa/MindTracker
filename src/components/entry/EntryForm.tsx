import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { getEntry, upsertEntry } from '@/db/queries'
import { formatDisplay } from '@/lib/dateUtils'
import { dailyEntrySchema, type DailyEntryFormValues } from '@/lib/entrySchema'
import { useEntryStore } from '@/stores/entryStore'
import type { DailyEntry } from '@/types/models'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  toast,
} from '@/components/ui'
import { EnvironmentSelector } from '@/components/entry/EnvironmentSelector'
import { HeadacheSelector } from '@/components/entry/HeadacheSelector'
import { NotesField } from '@/components/entry/NotesField'

type FormStatus = 'loading' | 'empty' | 'prefilled' | 'dirty' | 'saving' | 'saved'

interface EntryFormProps {
  selectedDate: string
}

function toFormValues(entry: DailyEntry | undefined, selectedDate: string): Partial<DailyEntryFormValues> {
  return {
    dateKey: selectedDate,
    headacheIntensity: entry?.headacheIntensity,
    workEnvironment: entry?.workEnvironment,
    notes: entry?.notes ?? '',
  }
}

function normalizeNotes(notes: string | null | undefined): string | null {
  return notes && notes.trim().length > 0 ? notes : null
}

export function EntryForm({ selectedDate }: EntryFormProps) {
  const setDraft = useEntryStore((state) => state.setDraft)
  const resetDraft = useEntryStore((state) => state.resetDraft)
  const [loadedEntry, setLoadedEntry] = useState<DailyEntry | undefined>()
  const [formStatus, setFormStatus] = useState<FormStatus>('loading')

  const {
    control,
    formState,
    handleSubmit,
    reset,
    setValue,
  } = useForm<DailyEntryFormValues>({
    defaultValues: {
      dateKey: selectedDate,
      notes: '',
    },
    resolver: zodResolver(dailyEntrySchema),
  })

  const watchedValues = useWatch({ control })
  const headacheIntensity = useWatch({ control, name: 'headacheIntensity' })
  const workEnvironment = useWatch({ control, name: 'workEnvironment' })
  const notesValue = useWatch({ control, name: 'notes' }) ?? ''

  useEffect(() => {
    let isCurrent = true

    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reset form state on date change
    setFormStatus('loading')
    setLoadedEntry(undefined)
    resetDraft()
    useEntryStore.setState({ isSaving: false })

    void getEntry(selectedDate).then((entry) => {
      if (!isCurrent) {
        return
      }

      setLoadedEntry(entry)
      reset(toFormValues(entry, selectedDate))
      setDraft({
        ...entry,
        dateKey: selectedDate,
        notes: entry?.notes ?? null,
      })
      setFormStatus(entry ? 'prefilled' : 'empty')
    })

    return () => {
      isCurrent = false
    }
  }, [reset, resetDraft, selectedDate, setDraft])

  useEffect(() => {
    setDraft({
      dateKey: selectedDate,
      headacheIntensity: watchedValues.headacheIntensity,
      workEnvironment: watchedValues.workEnvironment,
      notes: normalizeNotes(watchedValues.notes),
    })
  }, [selectedDate, setDraft, watchedValues])

  useEffect(() => {
    if (formStatus !== 'loading' && formStatus !== 'saving' && formState.isDirty) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: track dirty state
      setFormStatus('dirty')
    }
  }, [formState.isDirty, formStatus])

  const isSaving = formStatus === 'saving'
  const isLoading = formStatus === 'loading'
  const isSaveDisabled =
    isLoading ||
    isSaving ||
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- field may be undefined before user selects
    !headacheIntensity ||
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- field may be undefined before user selects
    !workEnvironment ||
    !formState.isDirty

  const buttonLabel = useMemo(() => {
    if (isSaving) {
      return 'Saving…'
    }

    if (formStatus === 'saved') {
      return 'Saved'
    }

    return 'Save entry'
  }, [formStatus, isSaving])

  const onSubmit = handleSubmit(async (values) => {
    // eslint-disable-next-line react-hooks/purity -- called inside submit handler, not during render
    const timestamp = Date.now()
    const payload: DailyEntry = {
      dateKey: selectedDate,
      headacheIntensity: values.headacheIntensity,
      workEnvironment: values.workEnvironment,
      notes: normalizeNotes(values.notes),
      createdAt: loadedEntry?.createdAt ?? timestamp,
      updatedAt: timestamp,
    }

    useEntryStore.setState({ isSaving: true })
    setFormStatus('saving')

    try {
      await upsertEntry(payload)
      setLoadedEntry(payload)
      reset({
        ...payload,
        notes: payload.notes ?? '',
      })
      setDraft(payload)
      setFormStatus('saved')
      toast({
        title: 'Entry saved',
        description: `Saved for ${formatDisplay(selectedDate)}.`,
      })
    } finally {
      useEntryStore.setState({ isSaving: false })
    }
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-testid="entry-form-skeleton">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>Daily entry</CardTitle>
        <p className="text-sm text-text-muted">
          Capture the essentials for {formatDisplay(selectedDate)}.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" noValidate onSubmit={(e) => { void onSubmit(e) }}>
          <HeadacheSelector
            disabled={isSaving}
            error={formState.errors.headacheIntensity?.message}
            onChange={(value) => {
              setValue('headacheIntensity', value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }}
            value={headacheIntensity}
          />

          <EnvironmentSelector
            disabled={isSaving}
            error={formState.errors.workEnvironment?.message}
            onChange={(value) => {
              setValue('workEnvironment', value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }}
            value={workEnvironment}
          />

          <NotesField
            disabled={isSaving}
            error={formState.errors.notes?.message}
            onChange={(value) => {
              setValue('notes', value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }}
            value={notesValue}
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="text-sm text-text-muted">
              {formStatus === 'saved'
                ? 'All changes saved.'
                : loadedEntry
                  ? 'Update this entry when something changes.'
                  : 'Select the required fields to enable saving.'}
            </p>
            <Button className="min-h-12 sm:min-w-32" disabled={isSaveDisabled} type="submit">
              {buttonLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
