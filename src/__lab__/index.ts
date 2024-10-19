import useApi from '../http'
;(async () => {
  const [result1] = await useApi().requests<[['DATA1', 'ERROR1', 'BODY1']]>({
    data: 'BODY1',
  })

  result1.data satisfies 'DATA1' | undefined
  result1.error satisfies 'ERROR1' | undefined

  const result = await useApi().request<'DATA', 'ERROR', 'BODY'>({
    data: 'BODY',
  })

  result.data satisfies 'DATA' | undefined
  result.error satisfies 'ERROR' | undefined
})()
