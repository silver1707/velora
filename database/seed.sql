-- Velora - dados de exemplo opcionais
-- 1. Crie uma usuária pelo cadastro do app ou pelo Supabase Auth.
-- 2. Copie o UUID dessa usuária em Authentication > Users.
-- 3. Substitua o UUID abaixo e rode este arquivo no SQL Editor.

do $$
declare
  owner_id uuid := '00000000-0000-0000-0000-000000000000';
  client_marina uuid;
  client_luiza uuid;
  product_mask uuid;
  product_color uuid;
  service_luzes uuid;
begin
  if owner_id = '00000000-0000-0000-0000-000000000000' then
    raise exception 'Substitua owner_id pelo UUID de uma usuária real do Supabase Auth.';
  end if;

  insert into public.clients (
    user_id, name, age, phone, neighborhood, birth_date, preferences,
    allergies, hair_type, favorite_products, chemical_history, service_frequency, notes
  )
  values
    (
      owner_id, 'Marina Costa', 31, '(11) 98888-0101', 'Jardins', '1994-08-12',
      'Prefere horários pela manhã e finalização com volume leve.',
      'Sensibilidade a descolorante forte.', 'Ondulado', 'Máscara nutritiva e leave-in leve.',
      'Luzes há 6 meses, tonalizante perolado.', 'Mensal', 'Gosta de registrar antes/depois.'
    )
  returning id into client_marina;

  insert into public.clients (
    user_id, name, age, phone, neighborhood, birth_date, preferences,
    allergies, hair_type, favorite_products, chemical_history, service_frequency
  )
  values
    (
      owner_id, 'Luiza Mendes', 27, '(11) 97777-0202', 'Pinheiros', '1998-03-22',
      'Finalização polida, sem perfume forte.', 'Sem alergias registradas.',
      'Liso', 'Protetor térmico e óleo reparador.', 'Progressiva em manutenção.',
      'Quinzenal'
    )
  returning id into client_luiza;

  insert into public.products (
    user_id, name, brand, category, stock_quantity, low_stock_threshold, cost, notes
  )
  values
    (owner_id, 'Máscara Nutri Glow', 'Velvet Hair', 'Máscara', 3, 2, 68.90, 'Usada em hidratações premium.')
  returning id into product_mask;

  insert into public.products (
    user_id, name, brand, category, stock_quantity, low_stock_threshold, cost, is_running_low
  )
  values
    (owner_id, 'Tonalizante Pérola 9.1', 'Color Belle', 'Coloração', 1, 2, 42.50, true)
  returning id into product_color;

  insert into public.service_records (
    user_id, client_id, service_type, scheduled_at, price, payment_method,
    notes, duration_minutes, status
  )
  values
    (
      owner_id, client_marina, 'Luzes', now() + interval '2 days', 360.00, 'Pix',
      'Fazer teste de mecha antes da aplicação completa.', 180, 'agendado'
    )
  returning id into service_luzes;

  insert into public.service_products (
    user_id, service_record_id, product_id, quantity_used
  )
  values
    (owner_id, service_luzes, product_color, 1),
    (owner_id, service_luzes, product_mask, 1);

  insert into public.service_records (
    user_id, client_id, service_type, scheduled_at, price, payment_method,
    notes, duration_minutes, status
  )
  values
    (
      owner_id, client_luiza, 'Escova', now() - interval '3 days', 90.00, 'Cartão de débito',
      'Resultado alinhado, manter protetor térmico.', 60, 'concluido'
    );

  insert into public.financial_entries (
    user_id, client_id, amount, payment_method, received_at, notes
  )
  values
    (
      owner_id, client_luiza, 90.00, 'Cartão de débito', now() - interval '3 days',
      'Recebimento de exemplo.'
    );
end $$;
