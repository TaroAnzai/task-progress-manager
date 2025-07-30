/**
 * Axiosエラーからユーザーに表示するエラーメッセージを抽出するユーティリティ関数
 */

export const extractErrorMessage = (error: unknown): string => {
  // AxiosError型であることを確認
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object"
  ) {
    const responseData = (error as any).response?.data;

    // marshmallow形式のエラー: errors -> { json: { message: [文字列] } }
    if (responseData?.errors && typeof responseData.errors === "object") {
      const errors = responseData.errors;

      // 最初のエラーメッセージを抽出
      const firstMessage =
        Object.values(errors)
          .flatMap((field: any) =>
            typeof field === "object" ? Object.values(field) : []
          )
          .flat()
          .find((msg) => typeof msg === "string");

      if (firstMessage) return firstMessage;
    }

    // 通常のメッセージがある場合
    if (typeof responseData?.message === "string") {
      return responseData.message;
    }

    // ステータスなど
    if (typeof responseData?.status === "string") {
      return responseData.status;
    }
  }

  // fallback
  if (error instanceof Error) {
    return error.message;
  }

  return "不明なエラーが発生しました";
};
