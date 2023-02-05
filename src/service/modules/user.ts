import request from "../index";

export async function changePasswordRequest(
  oldPassword: string,
  newPassword: string
): Promise<any> {
  const result = await request.patch({
    url: "/user/password",
    data: {
      oldPassword,
      newPassword,
    },
  });
  return result;
}

export async function changeUserAvatarRequest(data: any): Promise<any> {
  const result = await request.post({
    url: "/upload/avatar",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
  return result;
}

export async function getUserAvatarRequest(id: number): Promise<any> {
  const result: any = await request.get({
    url: `/user/avatar/${id}`,
    responseType: "blob",
  });
  const blob = new Blob([result], { type: result.type });
  const url = window.URL.createObjectURL(blob);
  return url;
}
