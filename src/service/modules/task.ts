import request from "../index";

export async function getTaskListRequest(classId: number): Promise<any> {
  const result = await request.get({
    url: `/task/${classId}`,
  });
  return result;
}
export async function addTaskRequest(data: any): Promise<any> {
  console.log(data);
  const result = await request.post({
    url: `/task`,
    data,
  });
  return result;
}
export async function updateTaskRequest(data: any): Promise<any> {
  const result = await request.patch({
    url: `/task`,
    data,
  });
  return result;
}
export async function removeTaskRequest(id: number): Promise<any> {
  const result = await request.delete({
    url: `/task`,
    data: {
      id,
    },
  });
  return result;
}
