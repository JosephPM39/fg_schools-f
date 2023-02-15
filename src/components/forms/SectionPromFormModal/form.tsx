import { ChangeEvent, FormEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { EmployeePositionFormInputs } from '../EmployeePositionFormInputs';
import { PositionType } from '../../../api/models_school/schools/position.model';
import { Button, Divider, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { ISchoolProm, ISectionProm } from '../../../api/models_school';
import { SelectEmployeePositionPromYear } from '../SelectEmployeePosition-PromYear';
import { useEmployee } from '../../../hooks/api/schools/useEmployee';
import { useEmployeePosition } from '../../../hooks/api/schools/useEmployeePosition';
import { SectionPromContext } from '../../../context/api/schools';
import { useSchool } from '../../../hooks/api/schools/useSchool';
import { getSubmitData, SubmitData } from './getData'
import { Alert, AlertProps, AlertWithError } from '../../Alert';
import { InvalidDataError, isInvalidDataError, promiseHandleError } from '../../../api/handlers/errors';
import { useTitle } from '../../../hooks/api/schools/useTitle';
import { useGroup } from '../../../hooks/api/schools/useGroup';
import { SelectSectionPromYear } from '../SelectSectionPromYear';
import { SectionInputs } from '../SectionInputs';

type SectionOrigin = 'new' | 'previous'
type ProfesorOrigin = 'new' | 'previous' | 'all'

export const Form = (params: { idForUpdate?: ISectionProm['id'], schoolPromId: ISchoolProm['id'] }) => {
  const { idForUpdate, schoolPromId } = params
  const form = useRef<HTMLFormElement | null>(null)

  const [sectionPromForUpdate, setSectionPromForUpdate] = useState<ISectionProm>()

  const [sectionOrigin, setSectionOrigin] = useState<SectionOrigin>('new')
  const [profesorOrigin, setProfesorOrigin] = useState<ProfesorOrigin>('new')
  const [sectionSelected, setSectionSelected] = useState<ISectionProm>()

  const [sectionInput, setSectionInput] = useState<ReactNode>(<>Loading</>)
  const [profesorInput, setProfesorInput] = useState<ReactNode>(<>Loading</>)

  const [isSending, setSending] = useState(false)

  const useEmployees = useEmployee()
  const useEmployeePositions = useEmployeePosition()
  const useSchools = useSchool()
  const useTitles = useTitle()
  const useGroups = useGroup()
  const useSectionProms = useContext(SectionPromContext)

  const [notify, setNotify] = useState<AlertProps | AlertWithError>()
  const [showNotify, setShowNofity] = useState(false)

  useEffect(() => {
    if (notify) setShowNofity(true)
  }, [notify])

  useEffect(() => {
    const getData = async () => {
      if (!idForUpdate || !!sectionPromForUpdate) return
      const res = await useSectionProms?.findOne({id: idForUpdate})
      if (!res) return
      return setSectionPromForUpdate(res)
    }
    getData()
  }, [idForUpdate, useSectionProms?.data, sectionPromForUpdate])

  useEffect(() => {
    if (!sectionSelected && profesorOrigin === 'previous') {
      setProfesorOrigin('new')
    }
    if (sectionOrigin === 'new' && sectionSelected) {
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
      if (!sectionSelected) return
      if (profesorOrigin !== 'previous') return
      return [sectionSelected]
    }

    const needYearSelect = () => {
      return profesorOrigin === 'all'
    }

    return setProfesorInput(
      <SelectEmployeePositionPromYear
        sections={getSectionProm()}
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
      return setSectionInput(<SelectSectionPromYear onSelect={(p) => setSectionSelected(p)}/>)
    }
  }, [sectionOrigin, sectionPromForUpdate, schoolPromId])

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
        value={sectionPromForUpdate?.['id'] || ''}
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
          (sectionOrigin === 'previous' && sectionSelected) &&
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
