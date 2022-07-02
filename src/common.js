export const titleJoins = (config) => {  
  const getArrays = (arrays) => {
    const  getValues = (arr1, arr2) => {
      const arr = []

      if (arr1.length === 0) {
        arr1 = arr2
        arr2 = []
      }

      for (const item of arr1) {
        if (arr2.length === 0) {
          arr.push(item)
        }

        for (const opt of arr2) {
          arr.push(item + opt)
        }
      }
    
      return arr
    }
  
    let arr = ['']

    for (const item of arrays) {
      arr = getValues(arr, item)
    }
  
    return arr
  }
  
  return getArrays(config)
}
