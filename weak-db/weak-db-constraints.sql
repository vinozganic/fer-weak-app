CREATE OR REPLACE FUNCTION check_vatin_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM tickets WHERE vatin = NEW.vatin) >= 3 THEN
    RAISE EXCEPTION 'Maximum of 3 tickets with the same VATIN allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_three_vatin
BEFORE INSERT OR UPDATE ON tickets
FOR EACH ROW EXECUTE FUNCTION check_vatin_count();