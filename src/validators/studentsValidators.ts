export const validateStudentName = (name: string) => {
  return /^[\p{L}]{2,16}$/u.test(name)
}

export const validateFinalGrade = (grade: string) => {
  return /^[1-5]$/.test(grade)
}

export const validateBirthDate = (birthDate: string) => {
  return !!birthDate
}

export const validateHobbies = (hobbies: string) => {
  return /^\s*(?!,)(\d|\p{L}|\s)*(\s*,\s*(\d|\p{L}|\s)+)*\s*$/u.test(hobbies)
}
