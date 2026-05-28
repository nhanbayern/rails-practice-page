import tutorialText from '../../imports/railstutorial.txt?raw';

export type StudyLanguage = 'en' | 'vi';

export type TutorialSlideLayout = 'overview' | 'reading' | 'code' | 'exercise' | 'diagram' | 'method';

export type TutorialMethod = {
  name: string;
  owner: string;
  category: string;
  count: number;
  examples: string[];
  explanation: Record<StudyLanguage, string>;
  mechanism: Record<StudyLanguage, string>;
};

export type TutorialSlide = {
  id: string;
  chapter: number;
  section: string;
  title: string;
  layout: TutorialSlideLayout;
  sourceText: string;
  codeBlocks: string[];
  methods: TutorialMethod[];
  diagram?: string;
  notes: Record<StudyLanguage, string[]>;
};

export type TutorialChapter = {
  id: string;
  chapter: number;
  title: string;
  sections: string[];
  slides: TutorialSlide[];
};

export type MethodGroup = {
  id: string;
  title: string;
  methods: TutorialMethod[];
};

const MAX_READING_CHARS = 1300;

const methodKnowledge: Record<string, Omit<TutorialMethod, 'name' | 'count' | 'examples'>> = {
  root: {
    owner: 'ActionDispatch::Routing',
    category: 'Routing',
    explanation: {
      en: 'Defines the application homepage route.',
      vi: 'Định nghĩa route trang chủ của ứng dụng.',
    },
    mechanism: {
      en: 'Rails adds a route for GET / and dispatches it to the configured controller action.',
      vi: 'Rails thêm route cho GET / rồi dispatch request tới controller action đã cấu hình.',
    },
  },
  get: {
    owner: 'ActionDispatch::Routing',
    category: 'Routing',
    explanation: {
      en: 'Maps an HTTP GET path to a controller action.',
      vi: 'Map một đường dẫn HTTP GET tới controller action.',
    },
    mechanism: {
      en: 'The router matches the verb and path, extracts params, then calls the controller action.',
      vi: 'Router match HTTP verb và path, trích params, rồi gọi controller action.',
    },
  },
  post: {
    owner: 'ActionDispatch::Routing',
    category: 'Routing',
    explanation: {
      en: 'Maps an HTTP POST request, usually for creating resources or submitting forms.',
      vi: 'Map HTTP POST request, thường dùng để tạo resource hoặc submit form.',
    },
    mechanism: {
      en: 'Rails routes the form submission to a create-like action and exposes submitted fields through params.',
      vi: 'Rails route form submission tới action kiểu create và đưa field đã submit vào params.',
    },
  },
  delete: {
    owner: 'ActionDispatch::Routing',
    category: 'Routing',
    explanation: {
      en: 'Maps a destructive HTTP DELETE request.',
      vi: 'Map HTTP DELETE request cho hành vi phá hủy/xóa.',
    },
    mechanism: {
      en: 'Rails UJS or Turbo converts a link/form interaction into DELETE, then routing dispatches it.',
      vi: 'Rails UJS hoặc Turbo chuyển tương tác link/form thành DELETE, sau đó routing dispatch.',
    },
  },
  resources: {
    owner: 'ActionDispatch::Routing',
    category: 'Routing',
    explanation: {
      en: 'Generates conventional REST routes for a resource.',
      vi: 'Sinh các REST route theo convention cho một resource.',
    },
    mechanism: {
      en: 'Rails expands one DSL call into index, show, new, create, edit, update, and destroy routes and helpers.',
      vi: 'Rails mở rộng một lệnh DSL thành các route/helper index, show, new, create, edit, update và destroy.',
    },
  },
  member: {
    owner: 'ActionDispatch::Routing',
    category: 'Routing',
    explanation: {
      en: 'Adds routes for actions on one resource member.',
      vi: 'Thêm route cho action thuộc một record cụ thể của resource.',
    },
    mechanism: {
      en: 'The generated path includes :id, such as /users/:id/following.',
      vi: 'Path được sinh có :id, ví dụ /users/:id/following.',
    },
  },
  render: {
    owner: 'ActionController / ActionView',
    category: 'Controller',
    explanation: {
      en: 'Builds a response in the same request.',
      vi: 'Tạo response trong cùng request hiện tại.',
    },
    mechanism: {
      en: 'The controller selects a template or response body without telling the browser to make a new request.',
      vi: 'Controller chọn template hoặc response body mà không yêu cầu browser tạo request mới.',
    },
  },
  redirect_to: {
    owner: 'ActionController',
    category: 'Controller',
    explanation: {
      en: 'Sends an HTTP redirect to start a new request.',
      vi: 'Gửi HTTP redirect để bắt đầu một request mới.',
    },
    mechanism: {
      en: 'Rails returns a 3xx response with a Location header; the browser then requests that URL.',
      vi: 'Rails trả response 3xx kèm Location header; browser sau đó request URL đó.',
    },
  },
  before_action: {
    owner: 'ActionController',
    category: 'Controller',
    explanation: {
      en: 'Runs filters before selected controller actions.',
      vi: 'Chạy filter trước các controller action được chọn.',
    },
    mechanism: {
      en: 'Rails invokes the callback chain before the action body; a redirect or render can halt the flow.',
      vi: 'Rails gọi chuỗi callback trước body action; redirect hoặc render có thể dừng flow.',
    },
  },
  params: {
    owner: 'ActionController::Parameters',
    category: 'Controller',
    explanation: {
      en: 'Contains route, query-string, and submitted form data.',
      vi: 'Chứa dữ liệu route, query string và form submit.',
    },
    mechanism: {
      en: 'Rails merges request data into a parameters object and provides strong-parameter filtering.',
      vi: 'Rails gom dữ liệu request vào parameters object và cung cấp cơ chế lọc strong parameters.',
    },
  },
  require: {
    owner: 'ActionController::Parameters',
    category: 'Controller',
    explanation: {
      en: 'Requires a nested parameter key.',
      vi: 'Yêu cầu tồn tại một key params lồng nhau.',
    },
    mechanism: {
      en: 'If the key is missing, Rails raises a parameter missing error instead of mass-assigning unsafe input.',
      vi: 'Nếu thiếu key, Rails raise lỗi parameter missing thay vì mass-assign input không an toàn.',
    },
  },
  permit: {
    owner: 'ActionController::Parameters',
    category: 'Controller',
    explanation: {
      en: 'Whitelists attributes allowed for mass assignment.',
      vi: 'Whitelist các attribute được phép mass assignment.',
    },
    mechanism: {
      en: 'Only permitted keys survive into model creation/update calls.',
      vi: 'Chỉ key được permit còn lại khi gọi create/update trên model.',
    },
  },
  flash: {
    owner: 'ActionDispatch::Flash',
    category: 'Controller',
    explanation: {
      en: 'Stores a short-lived message for the next request.',
      vi: 'Lưu message ngắn hạn cho request kế tiếp.',
    },
    mechanism: {
      en: 'Flash data is kept in session-like storage and swept after it is displayed.',
      vi: 'Flash được giữ trong storage kiểu session và bị dọn sau khi hiển thị.',
    },
  },
  'flash.now': {
    owner: 'ActionDispatch::Flash',
    category: 'Controller',
    explanation: {
      en: 'Stores a message only for the current rendered response.',
      vi: 'Lưu message chỉ cho response render hiện tại.',
    },
    mechanism: {
      en: 'Unlike regular flash, flash.now does not persist across a redirect/new request.',
      vi: 'Khác flash thường, flash.now không tồn tại qua redirect/request mới.',
    },
  },
  session: {
    owner: 'ActionDispatch::Session',
    category: 'Authentication',
    explanation: {
      en: 'Stores per-browser session state such as user_id.',
      vi: 'Lưu trạng thái session theo browser, ví dụ user_id.',
    },
    mechanism: {
      en: 'Rails serializes session state into the configured session store, cookie store by default.',
      vi: 'Rails serialize session state vào session store đã cấu hình, mặc định là cookie store.',
    },
  },
  cookies: {
    owner: 'ActionDispatch::Cookies',
    category: 'Authentication',
    explanation: {
      en: 'Reads and writes browser cookies.',
      vi: 'Đọc và ghi cookie trên browser.',
    },
    mechanism: {
      en: 'Rails sends Set-Cookie headers and parses Cookie headers on later requests.',
      vi: 'Rails gửi Set-Cookie header và parse Cookie header ở các request sau.',
    },
  },
  valid: {
    owner: 'ActiveRecord::Validations',
    category: 'Model',
    explanation: {
      en: 'Runs validations and returns whether the model is valid.',
      vi: 'Chạy validation và trả về model có hợp lệ hay không.',
    },
    mechanism: {
      en: 'Active Record executes validation callbacks and populates errors before returning true or false.',
      vi: 'Active Record chạy validation callback và điền errors trước khi trả true hoặc false.',
    },
  },
  validates: {
    owner: 'ActiveRecord::Validations',
    category: 'Model',
    explanation: {
      en: 'Declares model-level data rules.',
      vi: 'Khai báo rule dữ liệu ở tầng model.',
    },
    mechanism: {
      en: 'Rails registers validators that run before persistence and add messages to errors.',
      vi: 'Rails đăng ký validator chạy trước persistence và thêm message vào errors.',
    },
  },
  save: {
    owner: 'ActiveRecord::Persistence',
    category: 'Model',
    explanation: {
      en: 'Persists a model after running validations.',
      vi: 'Persist model sau khi chạy validation.',
    },
    mechanism: {
      en: 'Active Record creates or updates a database row depending on whether the object is new.',
      vi: 'Active Record create hoặc update row database tùy object là mới hay đã tồn tại.',
    },
  },
  update: {
    owner: 'ActiveRecord::Persistence',
    category: 'Model',
    explanation: {
      en: 'Assigns attributes and saves with validations.',
      vi: 'Gán attribute và save kèm validation.',
    },
    mechanism: {
      en: 'Rails mass-assigns permitted attributes, runs validations/callbacks, then writes to the database.',
      vi: 'Rails mass-assign attribute đã permit, chạy validation/callback rồi ghi database.',
    },
  },
  destroy: {
    owner: 'ActiveRecord::Persistence',
    category: 'Model',
    explanation: {
      en: 'Deletes a record while running callbacks.',
      vi: 'Xóa record trong khi vẫn chạy callback.',
    },
    mechanism: {
      en: 'Active Record invokes destroy callbacks and dependent association cleanup before/after deleting.',
      vi: 'Active Record gọi destroy callback và cleanup association phụ thuộc trước/sau khi xóa.',
    },
  },
  find: {
    owner: 'ActiveRecord::FinderMethods',
    category: 'Model',
    explanation: {
      en: 'Finds a row by primary key and raises if missing.',
      vi: 'Tìm row theo primary key và raise nếu không có.',
    },
    mechanism: {
      en: 'Active Record queries by id and raises ActiveRecord::RecordNotFound when no row matches.',
      vi: 'Active Record query theo id và raise ActiveRecord::RecordNotFound khi không match row nào.',
    },
  },
  find_by: {
    owner: 'ActiveRecord::FinderMethods',
    category: 'Model',
    explanation: {
      en: 'Finds the first row matching conditions or returns nil.',
      vi: 'Tìm row đầu tiên khớp điều kiện hoặc trả nil.',
    },
    mechanism: {
      en: 'Rails builds a WHERE query with LIMIT 1 and does not raise when no row matches.',
      vi: 'Rails tạo WHERE query kèm LIMIT 1 và không raise khi không có row match.',
    },
  },
  where: {
    owner: 'ActiveRecord::QueryMethods',
    category: 'Model',
    explanation: {
      en: 'Builds database query conditions.',
      vi: 'Tạo điều kiện query database.',
    },
    mechanism: {
      en: 'Active Record returns a lazy relation that becomes SQL when loaded.',
      vi: 'Active Record trả một relation lazy, chỉ thành SQL khi được load.',
    },
  },
  has_many: {
    owner: 'ActiveRecord::Associations',
    category: 'Association',
    explanation: {
      en: 'Declares a one-to-many collection association.',
      vi: 'Khai báo association collection một-nhiều.',
    },
    mechanism: {
      en: 'Rails creates reader/build/create/query methods and uses foreign keys to load related rows.',
      vi: 'Rails sinh method reader/build/create/query và dùng foreign key để load row liên quan.',
    },
  },
  belongs_to: {
    owner: 'ActiveRecord::Associations',
    category: 'Association',
    explanation: {
      en: 'Declares the owner side of an association.',
      vi: 'Khai báo phía thuộc về/owner của association.',
    },
    mechanism: {
      en: 'Rails expects a foreign key on the current model and creates methods to load the parent record.',
      vi: 'Rails kỳ vọng foreign key nằm trên model hiện tại và sinh method load record cha.',
    },
  },
  has_secure_password: {
    owner: 'ActiveModel::SecurePassword',
    category: 'Authentication',
    explanation: {
      en: 'Adds password digest and authentication behavior.',
      vi: 'Thêm behavior password digest và authentication.',
    },
    mechanism: {
      en: 'It uses bcrypt, virtual password fields, confirmation validation, and authenticate.',
      vi: 'Nó dùng bcrypt, virtual password fields, validation confirmation và authenticate.',
    },
  },
  authenticate: {
    owner: 'ActiveModel::SecurePassword / User',
    category: 'Authentication',
    explanation: {
      en: 'Checks a candidate password or token against a digest.',
      vi: 'Kiểm tra password hoặc token ứng viên với digest.',
    },
    mechanism: {
      en: 'The candidate secret is hashed with stored bcrypt parameters and compared without reversing the digest.',
      vi: 'Secret ứng viên được hash với tham số bcrypt đã lưu rồi so sánh, không đảo ngược digest.',
    },
  },
  form_with: {
    owner: 'ActionView::Helpers::FormHelper',
    category: 'View',
    explanation: {
      en: 'Builds a Rails form for a model or custom scope.',
      vi: 'Tạo Rails form cho model hoặc custom scope.',
    },
    mechanism: {
      en: 'Rails infers action, method, field names, authenticity token, and optionally remote submission.',
      vi: 'Rails suy ra action, method, tên field, authenticity token và tùy chọn remote submission.',
    },
  },
  link_to: {
    owner: 'ActionView::Helpers::UrlHelper',
    category: 'View',
    explanation: {
      en: 'Generates anchor tags using route helpers or URLs.',
      vi: 'Sinh thẻ anchor bằng route helper hoặc URL.',
    },
    mechanism: {
      en: 'Rails escapes content and builds hrefs, while UJS/Turbo can add non-GET behavior.',
      vi: 'Rails escape nội dung và tạo href, trong khi UJS/Turbo có thể thêm behavior non-GET.',
    },
  },
  assert_select: {
    owner: 'Rails Integration Test',
    category: 'Testing',
    explanation: {
      en: 'Asserts rendered HTML using CSS selectors.',
      vi: 'Assert HTML đã render bằng CSS selector.',
    },
    mechanism: {
      en: 'Rails parses the response body and counts selector matches.',
      vi: 'Rails parse response body và đếm các selector match.',
    },
  },
  assert_difference: {
    owner: 'ActiveSupport::Testing',
    category: 'Testing',
    explanation: {
      en: 'Asserts that an expression changes by a given amount.',
      vi: 'Assert một expression thay đổi theo lượng nhất định.',
    },
    mechanism: {
      en: 'The test evaluates the expression before and after the block, then compares the delta.',
      vi: 'Test evaluate expression trước và sau block, rồi so sánh delta.',
    },
  },
  assert_no_difference: {
    owner: 'ActiveSupport::Testing',
    category: 'Testing',
    explanation: {
      en: 'Asserts that an expression does not change.',
      vi: 'Assert một expression không thay đổi.',
    },
    mechanism: {
      en: 'It is the negative case companion for destructive or guarded actions.',
      vi: 'Đây là case âm đi cùng các action phá hủy hoặc được guard.',
    },
  },
  deliver_now: {
    owner: 'ActionMailer',
    category: 'Mailer',
    explanation: {
      en: 'Sends an email immediately.',
      vi: 'Gửi email ngay lập tức.',
    },
    mechanism: {
      en: 'Action Mailer renders mail templates, builds a Mail object, and uses the configured delivery method.',
      vi: 'Action Mailer render mail template, tạo Mail object và dùng delivery method đã cấu hình.',
    },
  },
};

const chapterBehavior: Record<number, { title: string; diagram: string; notes: Record<StudyLanguage, string[]> }> = {
  3: {
    title: 'Behavior Diagram: Static Page Request',
    diagram: `sequenceDiagram
    participant Browser
    participant Router as Rails Router
    participant Controller as StaticPagesController
    participant View as ERB Layout/View
    Browser->>Router: GET /help
    Router->>Controller: dispatch help action
    Controller->>View: implicit render help.html.erb
    View-->>Browser: HTML with layout and title`,
    notes: {
      en: ['Static pages still move through the full Rails request lifecycle.', 'Implicit rendering depends on action and template names matching.'],
      vi: ['Trang tĩnh vẫn đi qua đầy đủ lifecycle request của Rails.', 'Implicit render phụ thuộc tên action và template khớp nhau.'],
    },
  },
  7: {
    title: 'Behavior Diagram: Signup Flow',
    diagram: `sequenceDiagram
    participant Browser
    participant UsersController
    participant User
    participant Database
    Browser->>UsersController: POST /users with signup form
    UsersController->>User: User.new(user_params)
    User->>User: validations
    alt valid
      User->>Database: INSERT users
      UsersController-->>Browser: redirect_to user with flash
    else invalid
      UsersController-->>Browser: render new with errors
    end`,
    notes: {
      en: ['Strong parameters filter mass assignment before User.new.', 'Validation errors are available when rendering the same request.'],
      vi: ['Strong parameters lọc mass assignment trước User.new.', 'Validation errors có sẵn khi render trong cùng request.'],
    },
  },
  8: {
    title: 'Behavior Diagram: Login and Logout',
    diagram: `sequenceDiagram
    participant Browser
    participant SessionsController
    participant User
    participant Session
    Browser->>SessionsController: POST /login
    SessionsController->>User: find_by(email)
    SessionsController->>User: authenticate(password)
    alt success
      SessionsController->>Session: session[:user_id] = user.id
      SessionsController-->>Browser: redirect_to user
    else failure
      SessionsController-->>Browser: render login with flash.now
    end
    Browser->>SessionsController: DELETE /logout
    SessionsController->>Session: delete user_id
    SessionsController-->>Browser: redirect_to root`,
    notes: {
      en: ['The session stores identity, not the whole user object.', 'flash.now is correct for render; flash is correct for redirect.'],
      vi: ['Session lưu identity, không lưu toàn bộ user object.', 'flash.now đúng cho render; flash đúng cho redirect.'],
    },
  },
  9: {
    title: 'Behavior Diagram: Persistent Login',
    diagram: `sequenceDiagram
    participant Browser
    participant Helper as SessionsHelper
    participant User
    participant DB as Database
    Browser->>Helper: Request without session user_id
    Helper->>Browser: read encrypted user_id and remember_token cookies
    Helper->>DB: find user by id
    Helper->>User: authenticated?(:remember, token)
    alt token matches digest
      Helper->>Helper: log_in user
      Helper-->>Browser: current_user restored
    else token missing or invalid
      Helper-->>Browser: guest user
    end`,
    notes: {
      en: ['The browser holds the raw token; the database stores only a digest.', 'Revocation clears the digest so old cookies stop working.'],
      vi: ['Browser giữ raw token; database chỉ lưu digest.', 'Revoke xóa digest để cookie cũ ngừng hoạt động.'],
    },
  },
  11: {
    title: 'Behavior Diagram: Account Activation',
    diagram: `sequenceDiagram
    participant Browser
    participant UsersController
    participant UserMailer
    participant User
    participant ActivationsController
    Browser->>UsersController: POST /users
    UsersController->>User: save inactive user with activation_digest
    UsersController->>UserMailer: send activation email
    Browser->>ActivationsController: GET /account_activations/:token?email=...
    ActivationsController->>User: authenticated?(:activation, token)
    alt valid and inactive
      ActivationsController->>User: activate
      ActivationsController-->>Browser: log in and redirect
    else invalid
      ActivationsController-->>Browser: redirect with error
    end`,
    notes: {
      en: ['The email contains the raw token; the user row stores the digest.', 'Activation gates login until ownership of the email is verified.'],
      vi: ['Email chứa raw token; row user lưu digest.', 'Activation chặn login tới khi xác minh quyền sở hữu email.'],
    },
  },
  12: {
    title: 'Behavior Diagram: Password Reset',
    diagram: `sequenceDiagram
    participant Browser
    participant PasswordResetsController
    participant UserMailer
    participant User
    Browser->>PasswordResetsController: POST /password_resets with email
    PasswordResetsController->>User: create_reset_digest
    PasswordResetsController->>UserMailer: password_reset(user)
    Browser->>PasswordResetsController: GET /password_resets/:token/edit
    PasswordResetsController->>User: valid_user and token check
    Browser->>PasswordResetsController: PATCH /password_resets/:token
    alt token valid and not expired
      PasswordResetsController->>User: update password
      PasswordResetsController-->>Browser: log in and redirect
    else invalid
      PasswordResetsController-->>Browser: redirect/render error
    end`,
    notes: {
      en: ['Reset is a workflow resource, not a dedicated model table.', 'Expiration prevents old reset links from remaining valid.'],
      vi: ['Reset là workflow resource, không phải bảng model riêng.', 'Expiration ngăn link reset cũ còn hiệu lực mãi.'],
    },
  },
  13: {
    title: 'Behavior Diagram: Micropost Create and Feed',
    diagram: `sequenceDiagram
    participant Browser
    participant MicropostsController
    participant CurrentUser
    participant Micropost
    Browser->>MicropostsController: POST /microposts
    MicropostsController->>CurrentUser: current_user.microposts.build(params)
    CurrentUser->>Micropost: validates content/image
    alt valid
      Micropost->>Micropost: save with user_id
      MicropostsController-->>Browser: redirect root with success
    else invalid
      MicropostsController-->>Browser: render home feed with errors
    end`,
    notes: {
      en: ['Ownership is derived from current_user, not from a submitted user_id.', 'Server-side validations are the real boundary for uploads.'],
      vi: ['Ownership được suy ra từ current_user, không lấy từ user_id submit.', 'Validation server-side là boundary thật cho upload.'],
    },
  },
  14: {
    title: 'Behavior Diagram: Follow and Status Feed',
    diagram: `sequenceDiagram
    participant Browser
    participant RelationshipsController
    participant CurrentUser
    participant Relationship
    participant Feed as User#feed
    Browser->>RelationshipsController: POST /relationships followed_id
    RelationshipsController->>CurrentUser: follow(other_user)
    CurrentUser->>Relationship: create follower/followed edge
    Browser->>Feed: GET home feed
    Feed->>Relationship: find followed user ids
    Feed-->>Browser: own posts plus followed users posts`,
    notes: {
      en: ['Relationships create directed graph edges between users.', 'The feed query combines own microposts and followed users microposts.'],
      vi: ['Relationships tạo cạnh có hướng giữa các user.', 'Feed query kết hợp micropost của mình và của user đang follow.'],
    },
  },
};

function cleanupText(text: string) {
  return text
    .replace(/\r/g, '')
    .replace(/ï¬/g, 'fi')
    .replace(/ï¬‚/g, 'fl')
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/â€”/g, '-')
    .replace(/â€“/g, '-')
    .replace(/â€¦/g, '...')
    .replace(/â€¢/g, '-');
}

function stripPdfNoise(chapterText: string) {
  return chapterText
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (/^===== PDF page \d+ =====$/.test(trimmed)) return false;
      if (/^\d+$/.test(trimmed)) return false;
      if (/^\d+\s+CHAPTER\s+\d+\./.test(trimmed)) return false;
      if (/^\d+\.\d+\. [A-Z0-9 ,()#:'-]+\s+\d+$/.test(trimmed)) return false;
      if (/^CHAPTER\s+\d+\./.test(trimmed)) return false;
      return true;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getChapterRanges(text: string) {
  const start = text.search(/\nChapter 1\n/);
  const bookText = start >= 0 ? text.slice(start + 1) : text;
  const matches = Array.from(bookText.matchAll(/^Chapter\s+(\d+)\s*$/gm));
  const chapterRanges = matches.map((match, index) => {
    const chapter = Number(match[1]);
    const startIndex = match.index || 0;
    const endIndex = matches[index + 1]?.index || bookText.length;
    const chunk = bookText.slice(startIndex, endIndex);
    const title = chunk.split('\n').map((line) => line.trim()).find((line, lineIndex) => lineIndex > 0 && line.length > 0) || `Chapter ${chapter}`;
    return { chapter, title, text: stripPdfNoise(chunk) };
  });

  if (start > 0) {
    const frontMatter = stripPdfNoise(text.slice(0, start + 1));
    if (frontMatter.trim()) {
      chapterRanges.unshift({ chapter: 0, title: 'Front Matter and Contents', text: frontMatter });
    }
  }

  return chapterRanges;
}

function getSectionRanges(chapter: number, text: string) {
  const sectionRegex = new RegExp(`^(${chapter}\\.\\d+(?:\\.\\d+)?)\\s+([^\\n]+)$`, 'gm');
  const matches = Array.from(text.matchAll(sectionRegex)).filter((match) => {
    const title = match[2].trim();
    if (/^\d+$/.test(title)) return false;
    if (title === title.toUpperCase() && title.length > 8) return false;
    if (/\.{4,}/.test(title)) return false;
    return true;
  });

  if (matches.length === 0) {
    return [{ section: `${chapter}.0`, title: `Chapter ${chapter}`, text }];
  }

  return matches.map((match, index) => {
    const startIndex = match.index || 0;
    const endIndex = matches[index + 1]?.index || text.length;
    return {
      section: match[1],
      title: match[2].trim(),
      text: text.slice(startIndex, endIndex).trim(),
    };
  });
}

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function chunkText(text: string) {
  const paragraphs = splitParagraphs(text);
  const chunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    if (current && current.length + paragraph.length > MAX_READING_CHARS) {
      chunks.push(current.trim());
      current = paragraph;
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text.trim()];
}

function inferCodeBlocks(text: string) {
  const lines = text.split('\n');
  const blocks: string[] = [];
  let current: string[] = [];

  const isCodeLine = (line: string) => {
    const trimmed = line.trim();
    return (
      /^\$ /.test(trimmed) ||
      /^(class|module|def|end|if|else|elsif|do\b|resources\b|root\b|get\b|post\b|delete\b|before_action\b|has_many\b|belongs_to\b|validates\b)/.test(trimmed) ||
      /(<%|%>|assert_|rails |bundle |git |heroku |render |redirect_to|form_with|link_to|where\(|find_by\(|\.paginate|cookies|session)/.test(trimmed)
    );
  };

  for (const line of lines) {
    if (isCodeLine(line)) {
      current.push(line);
    } else if (current.length) {
      if (current.length >= 2) blocks.push(current.join('\n'));
      current = [];
    }
  }

  if (current.length >= 2) blocks.push(current.join('\n'));
  return blocks.slice(0, 4);
}

function detectLayout(text: string): TutorialSlideLayout {
  if (/^Exercises\b|Exercises\n|^\d+\. /.test(text.trim())) return 'exercise';
  if (/Listing \d+\.\d+|class |def |assert_|rails |bundle |git |heroku |<%=|form_with|link_to/.test(text)) return 'code';
  return 'reading';
}

function detectMethodNames(text: string) {
  const names = new Set<string>();
  const known = Object.keys(methodKnowledge).sort((a, b) => b.length - a.length);
  for (const name of known) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`(^|[^A-Za-z0-9_:.])${escaped}([^A-Za-z0-9_?!]|$)`).test(text)) {
      names.add(name);
    }
  }

  for (const match of text.matchAll(/\bdef\s+([a-zA-Z_][\w!?=]*)/g)) {
    names.add(match[1]);
  }

  for (const match of text.matchAll(/\.([a-zA-Z_][\w!?=]*)\b/g)) {
    const candidate = match[1];
    if (candidate.length > 2 && !['com', 'org', 'html', 'erb', 'jpg', 'png'].includes(candidate)) {
      names.add(candidate);
    }
  }

  return Array.from(names).slice(0, 18);
}

function methodFromName(name: string, example: string): TutorialMethod {
  const known = methodKnowledge[name];
  if (known) {
    return { name, count: 1, examples: [example], ...known };
  }

  const inferredCategory =
    /assert|test|fixture/.test(name) ? 'Testing' :
    /path|url|route/.test(name) ? 'Routing' :
    /save|update|destroy|find|where|create|build/.test(name) ? 'Model' :
    /render|redirect|params|flash/.test(name) ? 'Controller' :
    'Ruby/Rails method';

  return {
    name,
    owner: 'Detected from tutorial text',
    category: inferredCategory,
    count: 1,
    examples: [example],
    explanation: {
      en: 'This method name is detected from the imported tutorial text. Review its local code/listing context on the chapter slide before using it.',
      vi: 'Method này được detect từ text tutorial đã import. Hãy xem context code/listing ngay trong slide chương trước khi dùng.',
    },
    mechanism: {
      en: 'The exact behavior depends on the receiver object and Rails subsystem shown in the source listing.',
      vi: 'Cơ chế chính xác phụ thuộc receiver object và subsystem Rails xuất hiện trong listing nguồn.',
    },
  };
}

function methodsForText(text: string): TutorialMethod[] {
  return detectMethodNames(text).map((name) => methodFromName(name, text.slice(0, 260)));
}

function slideNotes(layout: TutorialSlideLayout, methods: TutorialMethod[], sourceText: string): Record<StudyLanguage, string[]> {
  const baseVi = [
    'Slide này giữ nguyên nội dung nguồn từ railstutorial.txt để không làm mất câu chữ của sách.',
    'Đọc theo thứ tự: ngữ cảnh -> code/listing -> method xuất hiện -> output/hành vi app.',
  ];
  const baseEn = [
    'This slide keeps the imported source text so the book content is not dropped.',
    'Read in order: context -> code/listing -> detected methods -> app behavior/output.',
  ];

  if (layout === 'code') {
    baseVi.push('Với code Rails, hãy xác định file, receiver object, callback/request lifecycle và test liên quan.');
    baseEn.push('For Rails code, identify the file, receiver object, callback/request lifecycle, and related test.');
  }

  if (layout === 'exercise') {
    baseVi.push('Exercise nên được đọc như một test ẩn: nó hỏi bạn dự đoán cơ chế, output hoặc failure mode.');
    baseEn.push('Treat exercises as hidden tests: they ask you to predict mechanism, output, or failure mode.');
  }

  if (methods.length) {
    baseVi.push(`Method trọng tâm detect được: ${methods.slice(0, 6).map((method) => method.name).join(', ')}.`);
    baseEn.push(`Detected focus methods: ${methods.slice(0, 6).map((method) => method.name).join(', ')}.`);
  }

  if (/race|concurrent|security|SSL|token|password|cookie|session/i.test(sourceText)) {
    baseVi.push('Đây là phần có rủi ro security/concurrency; cần hiểu boundary giữa browser, Rails app và database.');
    baseEn.push('This section has security/concurrency risk; understand the boundary between browser, Rails app, and database.');
  }

  return { en: baseEn, vi: baseVi };
}

function buildSlidesForSection(chapter: number, section: string, title: string, text: string): TutorialSlide[] {
  return chunkText(text).map((chunk, index) => {
    const layout = detectLayout(chunk);
    const methods = methodsForText(chunk);
    return {
      id: `c${chapter}_${section.replace(/\./g, '_')}_${index}`,
      chapter,
      section: index === 0 ? section : `${section}.${index + 1}`,
      title,
      layout,
      sourceText: chunk,
      codeBlocks: inferCodeBlocks(chunk),
      methods,
      notes: slideNotes(layout, methods, chunk),
    };
  });
}

function buildDiagramSlide(chapter: number): TutorialSlide | null {
  const behavior = chapterBehavior[chapter];
  if (!behavior) return null;

  return {
    id: `c${chapter}_diagram`,
    chapter,
    section: `${chapter}.flow`,
    title: behavior.title,
    layout: 'diagram',
    sourceText: '',
    codeBlocks: [],
    methods: [],
    diagram: behavior.diagram,
    notes: behavior.notes,
  };
}

function buildDeck() {
  const cleaned = cleanupText(tutorialText);
  const chapters = getChapterRanges(cleaned);

  return chapters.map<TutorialChapter>((chapterItem) => {
    const sections = getSectionRanges(chapterItem.chapter, chapterItem.text);
    const slides: TutorialSlide[] = [
      {
        id: `c${chapterItem.chapter}_overview`,
        chapter: chapterItem.chapter,
        section: `Chapter ${chapterItem.chapter}`,
        title: chapterItem.title,
        layout: 'overview',
        sourceText: chapterItem.text.split('\n').slice(0, 18).join('\n'),
        codeBlocks: [],
        methods: methodsForText(chapterItem.text).slice(0, 12),
        notes: {
          en: ['Chapter overview generated from the imported tutorial text.', 'Use the section chips to jump into the exact book content.'],
          vi: ['Overview chương được sinh từ text tutorial đã import.', 'Dùng chip section để nhảy vào đúng nội dung sách.'],
        },
      },
    ];

    const diagramSlide = buildDiagramSlide(chapterItem.chapter);
    if (diagramSlide) slides.push(diagramSlide);

    for (const section of sections) {
      slides.push(...buildSlidesForSection(chapterItem.chapter, section.section, section.title, section.text));
    }

    return {
      id: `chapter_${String(chapterItem.chapter).padStart(2, '0')}`,
      chapter: chapterItem.chapter,
      title: chapterItem.title,
      sections: sections.map((section) => `${section.section} ${section.title}`),
      slides,
    };
  });
}

function buildMethodGroups(chapters: TutorialChapter[]): MethodGroup[] {
  const map = new Map<string, TutorialMethod>();

  for (const chapter of chapters) {
    for (const slide of chapter.slides) {
      for (const method of slide.methods) {
        const current = map.get(method.name);
        if (current) {
          current.count += 1;
          if (current.examples.length < 4) current.examples.push(slide.sourceText.slice(0, 260));
        } else {
          map.set(method.name, { ...method, examples: method.examples.slice(0, 1) });
        }
      }
    }
  }

  const methods = Array.from(map.values()).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  const grouped = new Map<string, TutorialMethod[]>();
  for (const method of methods) {
    const list = grouped.get(method.category) || [];
    list.push(method);
    grouped.set(method.category, list);
  }

  return Array.from(grouped.entries()).map(([category, categoryMethods]) => ({
    id: category.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    title: category,
    methods: categoryMethods,
  }));
}

export const fullTutorialChapters = buildDeck();
export const fullMethodGroups = buildMethodGroups(fullTutorialChapters);
export const totalTutorialSlides = fullTutorialChapters.reduce((sum, chapter) => sum + chapter.slides.length, 0);
