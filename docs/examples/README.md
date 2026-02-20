# API Request Examples

Šeit ir gatavi `curl` piemēri visiem `v1` endpointiem no `docs/openapi-v1.yaml`.

## 1) Sagatavošana

```bash
cd docs/examples
cp .env.example .env
# aizpildi .env ar reālajām vērtībām
```

## 2) Palaišana

Katram failam:

```bash
bash curl/01-projects-list.sh
```

## 3) Piezīmes

- Visi requesti izmanto `Authorization: Bearer $TOKEN`.
- `BASE_URL` jānorāda ar `/api` beigās, piemēram: `https://example.com/api`.
- Failu augšupielādei (`receipts/upload`) iestati `FILE_PATH` uz čeka bildi.
