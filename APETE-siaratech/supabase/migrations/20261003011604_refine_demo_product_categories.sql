-- Categorias conforme o alimento; somente os exemplos recém-adicionados.
update public.products set category=case public_id
 when 1013 then 'Legumes' when 1024 then 'Tapiocas' when 1039 then 'Lanches'
 when 1043 then 'Hortaliças' when 1058 then 'Hortaliças' end
where demo and public_id in (1013,1024,1039,1043,1058);
