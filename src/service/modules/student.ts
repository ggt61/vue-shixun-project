import request from "../index";

export async function getStudentListRequest(id: number): Promise<any> {
  const reuslt = await request.get({
    url: `/user/${id}`,
  });
  return reuslt;
}

export async function addStudentRequest(student: any): Promise<any> {
  const reuslt = await request.post({
    url: `/user`,
    data: student,
  });
  return reuslt;
}
export async function updateStudentRequest(student: any): Promise<any> {
  const reuslt = await request.patch({
    url: `/user`,
    data: student,
  });
  return reuslt;
}
export async function removeStudentRequest(id: number): Promise<any> {
  const reuslt = await request.delete({
    url: `/user/${id}`,
  });
  return reuslt;
}
