import { ChangeEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { EmployeePositionFormInputs } from '../EmployeePositionFormInputs'
import { PositionType } from '../../../../api/models_school/schools/position.model'
import { Button, Divider, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { ISchool, ISectionProm } from '../../../../api/models_school'
import { SelectEmployeePositionPromYear } from '../SelectEmployeePosition-PromYear'
import { SectionPromContext } from '../../../../context/api/schools'
import { Alert, AlertProps, AlertWithError } from '../../../Alert'
import { SelectSectionPromYear } from '../SelectSectionPromYear'
import { SectionInputs } from '../SectionInputs'

type SectionOrigin = 'new' | 'previous'
type ProfesorOrigin = 'new' | 'previous' | 'all'

interface Params {
  idForUpdate?: ISectionProm['id']
  schoolId: ISchool['id']
}

export const Form = (params: Params) => {
  const { idForUpdate, schoolId } = params
  const form = useRef<HTMLFormElement | null>(null)

  const [sectionPromForUpdate, setSectionPromForUpdate] = useState<ISectionProm>()

  const [sectionOrigin, setSectionOrigin] = useState<SectionOrigin>('new')
  const [profesorOrigin, setProfesorOrigin] = useState<ProfesorOrigin>('new')
  const [sectionSelected, setSectionSelected] = useState<ISectionProm>()

  const [sectionInput, setSectionInput] = useState<ReactNode>(<>Loading</>)
  const [profesorInput, setProfesorInput] = useState<ReactNode>(<>Loading</>)

  const [isSending] = useState<boolean>(false)

  const useSectionProms = useContext(SectionPromContext)

  const [notify, setNotify] = useState<AlertProps | AlertWithError>()
  const [showNotify, setShowNofity] = useState(false)

  useEffect(() => {
    if (notify != null) setShowNofity(true)
  }, [notify])

  console.log('loop')

  useEffect(() => {
    const getData = async () => {
      if (!idForUpdate || !(sectionPromForUpdate == null)) return
      const res = await useSectionProms?.findOne({ id: idForUpdate })
      if (res == null) return
      return setSectionPromForUpdate(res)
    }
    void getData()
  }, [idForUpdate, useSectionProms?.data, sectionPromForUpdate])

  useEffect(() => {
    if ((sectionSelected == null) && profesorOrigin === 'previous') {
      setProfesorOrigin('new')
    }
    if (sectionOrigin === 'new' && (sectionSelected != null)) {
      setSectionSelected(undefined)
    }
  }, [sectionSelected, profesorOrigin, sectionOrigin])

  useEffect(() => {
    if (profesorOrigin === 'new') {
      const input = <EmployeePositionFormInputs
        idForUpdate={sectionPromForUpdate?.profesorId}
        type={PositionType.PROFESOR}
      />
      return setProfesorInput(input)
    }

    const getSectionProm = () => {
      if (sectionSelected == null) return
      if (profesorOrigin !== 'previous') return
      return [sectionSelected]
    }

    const needYearSelect = () => {
      return profesorOrigin === 'all'
    }

    return setProfesorInput(
      <SelectEmployeePositionPromYear
        sectionProms={getSectionProm()}
        yearSelect={needYearSelect()}
        type={PositionType.PROFESOR}
      />
    )
  }, [profesorOrigin, sectionSelected, sectionPromForUpdate])

  useEffect(() => {
    if (sectionOrigin === 'new') {
      return setSectionInput(<SectionInputs
        idForUpdate={sectionPromForUpdate?.id}
      />)
    }
    if (sectionOrigin === 'previous') {
      return setSectionInput(<SelectSectionPromYear
        onChange={(p) => setSectionSelected(p)}
        schoolId={schoolId}
      />)
    }
  }, [sectionOrigin, sectionPromForUpdate, schoolId])

  const onChangeSectionOrigin = (e: ChangeEvent<HTMLInputElement>) => {
    setSectionOrigin(e.target.value as SectionOrigin)
    if (e.target.value === 'new' && profesorOrigin === 'previous') {
      setProfesorOrigin('new')
    }
  }

  const onChangeProfesorOrigin = (e: ChangeEvent<HTMLInputElement>) => {
    setProfesorOrigin(e.target.value as ProfesorOrigin)
  }

  return <>
    <form ref={form}>
      <input
        name="section_prom_id"
        type='text'
        value={sectionPromForUpdate?.id}
        onChange={() => {}}
        hidden
      />
      <FormLabel>Sección: </FormLabel>
      <RadioGroup row onChange={onChangeSectionOrigin} value={sectionOrigin}>
        <FormControlLabel
          value='new'
          control={<Radio/>}
          label={params?.idForUpdate ? 'Editar' : 'Nueva'}
        />
        <FormControlLabel
          value='previous'
          control={<Radio/>}
          label={params?.idForUpdate ? 'Cambiar por' : 'Habilitar'}
        />
      </RadioGroup>
      {sectionInput}
      <br/>
      <Divider/>
      <br/>
      <FormLabel>Docente: </FormLabel>
      <RadioGroup row onChange={onChangeProfesorOrigin} value={profesorOrigin}>
        <FormControlLabel
          value='new'
          control={<Radio/>}
          label={params?.idForUpdate ? 'Editar' : 'Nuevo'}
        />
        {
          (sectionOrigin === 'previous' && (sectionSelected != null)) &&
          <FormControlLabel
            value='previous'
            control={<Radio/>}
            label='Escuela seleccionada'
          />
        }
        <FormControlLabel
          value='all'
          control={<Radio/>}
          label='De otras escuelas y años'
        />
      </RadioGroup>
      {profesorInput}
      <br/>
      <Button type='submit' variant='contained' disabled={isSending || showNotify}>
        {isSending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
    <Alert
      show={showNotify}
      onClose={() => {
        setShowNofity(false)
        setNotify(undefined)
      }}
      {...notify}
    />
  </>
}
