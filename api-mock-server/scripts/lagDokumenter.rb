require 'json'
require 'faker'
require 'sqlite3'

def init()
    begin
        db = SQLite3::Database.open ARGV[0]
        db.execute "DROP TABLE IF EXISTS Dokumenter"

        db.execute "CREATE TABLE Dokumenter
            (
            	journalpostId TEXT NOT NULL,
            	dokumentInfoId TEXT NOT NULL,
            	tittel TEXT,
            	tema TEXT,
            	registrert TEXT,
            	harTilgangTilArkivvariant INTEGER,
              PRIMARY KEY (journalpostId, dokumentInfoId)
            )
            "
  rescue SQLite3::Exception => e

      puts "Exception occurred"
      puts e

  ensure
      db.close if db
  end
end

def insert_dokument(journalpostId, dokumentInfoId, tittel, tema, registrert, harTilgangTilArkivvariant)
  begin
	  db = SQLite3::Database.open ARGV[0]
      db.execute("INSERT INTO Dokumenter (journalpostId, dokumentInfoId, tittel, tema, registrert, harTilgangTilArkivvariant) VALUES (?, ?, ?, ?, ?, ?)",
                                        [journalpostId, dokumentInfoId, tittel, tema, registrert.to_s, harTilgangTilArkivvariant])

  rescue SQLite3::Exception => e
    puts "Exception occurred"
    puts e
    exit
  ensure
    db.close if db
  end
end

def tilfeldigTema()
  r = rand(3)
  if r == 0
    return "SYK"
  end
  if r == 1
    return "DAG"
  end
  if r == 2
    return "FOR"
  end
  return "SYK"
end

def lagDokument()
  journalpostId = Faker::Number.number(digits: 2)
  dokumentInfoId = Faker::Number.number(digits: 9)
  tittel = Faker::Book.title()
  tema = tilfeldigTema()
  registrert = Faker::Date.backward(days: 365)
  harTilgangTilArkivvariant = Faker::Boolean.boolean(true_ratio: 0.8) ? 1 : 0
  insert_dokument(journalpostId, dokumentInfoId, tittel, tema, registrert, harTilgangTilArkivvariant)
end

init()

i=0

# trenger disse for test
insert_dokument("test_journalpostId", "test_dokumentInfoId", "test_tittel", "test_tema", "2020-12-31", 1)

loop do
  lagDokument()
  i += 1;
  if i == 500
    break
  end
end
