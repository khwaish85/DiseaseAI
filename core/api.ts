const BASE_URL = 'http://192.168.1.8:5000';

export const predictCommonDisease = async (text: string) => {
  const form = new FormData();
  form.append('symptoms', text);
  const response = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    body: form,
  });
  return response.text();
};

export const predictHeart = async (features: number[]) => {
  const form = new FormData();
  const fields = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
  ];
  fields.forEach((field, i) => form.append(field, features[i].toString()));
  const response = await fetch(`${BASE_URL}/predict-heart-disease`, {
    method: 'POST',
    body: form,
  });
  return response.text();
};